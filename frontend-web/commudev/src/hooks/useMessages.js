// src/hooks/useMessages.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  subscribeToMessages, 
  sendMessage, 
  getOrCreateConversation, 
  subscribeToUserConversations,
  setupPresence,
  subscribeToUserPresence,
  markMessagesAsRead,
  updateTypingStatus,
  subscribeToTypingStatus
} from '../services/firebaseService';
import useProfile from './useProfile';
import { getUserById } from '../services/userService';

const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const { profile } = useProfile();
  const [lastRefresh, setLastRefresh] = useState(Date.now());


  // Set up presence when profile is loaded
  useEffect(() => {
    if (!profile?.id) return;
    
    const displayName = `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || profile.username;
    setupPresence(profile.id.toString(), displayName);
  }, [profile]);

  // Subscribe to user's conversations
  useEffect(() => {
    if (!profile?.id) return;

    setLoading(true);
    const unsubscribe = subscribeToUserConversations(
      profile.id.toString(), 
      (newConversations) => {
        setConversations(newConversations);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [profile]);

  // Subscribe to messages when a conversation is selected
  useEffect(() => {
    if (!currentConversation) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMessages(
      currentConversation, 
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentConversation]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (!currentConversation || !profile?.id) return;
    
    markMessagesAsRead(currentConversation, profile.id.toString());
  }, [currentConversation, messages, profile]);

  // Subscribe to typing status
  useEffect(() => {
    if (!currentConversation || !profile?.id) return;
    
    const unsubscribe = subscribeToTypingStatus(
      currentConversation,
      profile.id.toString(),
      (typingUserIds) => {
        setTypingUsers(typingUserIds);
      }
    );
    
    return () => unsubscribe();
  }, [currentConversation, profile]);

  // Handle user typing status
  useEffect(() => {
    if (!currentConversation || !profile?.id) return;
    
    if (isTyping) {
      updateTypingStatus(currentConversation, profile.id.toString(), true);
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to clear typing status after 5 seconds
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        updateTypingStatus(currentConversation, profile.id.toString(), false);
      }, 5000);
    } else {
      updateTypingStatus(currentConversation, profile.id.toString(), false);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, currentConversation, profile]);

  // Start or open a conversation with a user
  const startConversation = async (otherUserId) => {
    if (!profile || !profile.id) {
      setError('You must be logged in to send messages');
      return null;
    }
  
    try {
      console.log(`Starting conversation with user ID: ${otherUserId}`);
      
      // First check if we already have a conversation with this user
      const existingConversation = conversations.find(conv => 
        conv.otherUserId === otherUserId.toString()
      );
      
      if (existingConversation) {
        console.log('Found existing conversation:', existingConversation);
        setCurrentConversation(existingConversation.id);
        
        // Set the selected user from existing data
        setSelectedUser({
          id: otherUserId,
          name: existingConversation.otherUserName || 'User',
          avatar: existingConversation.otherUserAvatar,
          username: existingConversation.userData?.[otherUserId]?.username || ''
        });
        
        return existingConversation.id;
      }
      
      // If no existing conversation, get other user's data
      let otherUserData;
      try {
        otherUserData = await getUserById(otherUserId);
        console.log('Found other user:', otherUserData);
      } catch (err) {
        console.error('Error getting other user:', err);
        setError('User not found');
        return null;
      }
      
      if (!otherUserData) {
        console.error('Other user data is null or undefined');
        setError('User not found');
        return null;
      }
      
      // Create current user data object for Firebase
      const currentUserData = {
        id: profile.id,
        username: profile.username || '',
        firstname: profile.firstname || '',
        lastname: profile.lastname || '',
        profilePicture: profile.profilePicture || ''
      };

      const otherUser = {
        id: otherUserData.id,
        username: otherUserData.username || '',
        firstname: otherUserData.firstname || '',
        lastname: otherUserData.lastname || '',
        profilePicture: otherUserData.profilePicture || ''
      };

      console.log('Creating conversation between:', currentUserData, otherUser);
      
      const conversationId = await getOrCreateConversation(
        profile.id.toString(), 
        otherUserId.toString(),
        currentUserData,
        otherUser
      );

      console.log('Created/found conversation with ID:', conversationId);
      
      // Select the conversation
      setCurrentConversation(conversationId);
      
      // Set the selected user for UI
      setSelectedUser({
        id: otherUserId,
        name: `${otherUser.firstname || ''} ${otherUser.lastname || ''}`.trim() || otherUser.username || 'User',
        avatar: otherUser.profilePicture,
        username: otherUser.username
      });
      
      // Force reload of conversations
      setTimeout(() => {
        // This will trigger a re-render of the conversations list
        setLastRefresh(Date.now());
      }, 500);
      
      return conversationId;
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Failed to start conversation');
      return null;
    }
  };

  // Send a message in the current conversation
  const sendNewMessage = async (text) => {
    if (!currentConversation || !profile || !profile.id) {
      setError('Cannot send message');
      return false;
    }

    try {
      await sendMessage(currentConversation, {
        senderId: profile.id.toString(),
        senderName: `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || profile.username,
        senderUsername: profile.username,
        senderAvatar: profile.profilePicture,
        text: text
      });
      
      // Clear typing status after sending
      setIsTyping(false);
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return false;
    }
  };

  // Handle typing input
  const handleTypingInput = useCallback(() => {
    setIsTyping(true);
  }, []);

  // Select a conversation from the list
  const selectConversation = useCallback((conversation) => {
    setCurrentConversation(conversation.id);
    
    // Set selected user data
    const userData = conversation.userData?.[conversation.otherUserId] || {};
    setSelectedUser({
      id: conversation.otherUserId,
      name: userData.name || 'User',
      avatar: userData.avatar,
      username: userData.username
    });
  }, []);

  return {
    conversations,
    messages,
    currentConversation,
    selectedUser,
    typingUsers,
    loading,
    error,
    startConversation,
    sendNewMessage,
    selectConversation,
    handleTypingInput,
    setLastRefresh
  };
};

export default useMessages;