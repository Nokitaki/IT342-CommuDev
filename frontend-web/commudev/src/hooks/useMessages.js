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
  subscribeToTypingStatus,
  updateMessage,
  deleteMessage as firebaseDeleteMessage,
  deleteConversation,
  debugFirestore
} from '../services/firebaseService';
import useProfile from './useProfile';
import { getUserById } from '../services/userService';
import { auth } from '../services/firebaseAuth';

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
  const userId = profile?.id ? profile.id.toString() : localStorage.getItem('userId');
  
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Debug Firebase auth state
  useEffect(() => {
    console.log("Current Firebase auth state:", auth.currentUser);
    
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("Auth state changed:", user ? `User ${user.uid} logged in` : "User logged out");
    });
    
    return () => unsubscribe();
  }, []);

  // Debug Firestore conversations
  useEffect(() => {
    const checkFirestore = async () => {
      console.log("Debugging Firestore conversations...");
      try {
        const allConversations = await debugFirestore();
        console.log("All conversations in Firestore:", allConversations);
      } catch (err) {
        console.error("Error debugging Firestore:", err);
      }
    };
    
    checkFirestore();
  }, []);

  // Set up presence when profile is loaded
  useEffect(() => {
    if (!profile?.id) {
      console.log("No profile ID available for presence setup");
      return;
    }
    
    const displayName = `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || profile.username;
    console.log("Setting up presence for user:", profile.id.toString(), displayName);
    setupPresence(profile.id.toString(), displayName);
  }, [profile]);

  // Subscribe to user's conversations
  useEffect(() => {
    if (!userId) {
      console.log("No user ID available, can't subscribe to conversations");
      return;
    }
    
    console.log("Subscribing to conversations for user ID:", userId);
    
    try {
      const displayName = profile ? 
        `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || profile.username : 
        'User';
      setupPresence(userId, displayName);
    } catch (error) {
      console.error('Error setting up presence:', error);
    }

    setLoading(true);
    const unsubscribe = subscribeToUserConversations(
      userId, 
      (newConversations) => {
        console.log("Received conversations:", newConversations);
        setConversations(newConversations);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, profile]);

  // Subscribe to messages when a conversation is selected
  useEffect(() => {
    if (!currentConversation) {
      setMessages([]);
      return;
    }

    console.log("Subscribing to messages for conversation:", currentConversation);
    setLoading(true);
    const unsubscribe = subscribeToMessages(
      currentConversation, 
      (newMessages) => {
        console.log("Received messages:", newMessages.length);
        setMessages(newMessages);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentConversation]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (!currentConversation || !userId) {
      return;
    }
    
    console.log("Marking messages as read in conversation:", currentConversation);
    markMessagesAsRead(currentConversation, userId);
  }, [currentConversation, messages, userId]);

  // Subscribe to typing status
  useEffect(() => {
    if (!currentConversation || !userId) {
      return;
    }
    
    console.log("Subscribing to typing status for conversation:", currentConversation);
    const unsubscribe = subscribeToTypingStatus(
      currentConversation,
      userId,
      (typingUserIds) => {
        setTypingUsers(typingUserIds);
      }
    );
    
    return () => unsubscribe();
  }, [currentConversation, userId]);

  // Handle user typing status
  useEffect(() => {
    if (!currentConversation || !userId) {
      return;
    }
    
    if (isTyping) {
      updateTypingStatus(currentConversation, userId, true);
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to clear typing status after 5 seconds
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        updateTypingStatus(currentConversation, userId, false);
      }, 5000);
    } else {
      updateTypingStatus(currentConversation, userId, false);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, currentConversation, userId]);

  // Start or open a conversation with a user
  const startConversation = async (otherUserId) => {
    if (!userId) {
      console.error("No user ID available, can't start conversation");
      throw new Error('You must be logged in to send messages');
    }
  
    try {
      console.log(`Starting conversation between ${userId} and ${otherUserId}`);
      
      // Make sure both IDs are strings
      const myUserId = userId;
      const otherUserIdStr = otherUserId.toString();
      
      // First check if we already have a conversation with this user
      const existingConversation = conversations.find(conv => 
        conv.otherUserId === otherUserIdStr
      );
      
      if (existingConversation) {
        console.log('Found existing conversation:', existingConversation);
        setCurrentConversation(existingConversation.id);
        
        // Set the selected user from existing data
        setSelectedUser({
          id: otherUserIdStr,
          name: existingConversation.otherUserName || 'User',
          avatar: existingConversation.otherUserAvatar,
          username: existingConversation.userData?.[otherUserIdStr]?.username || ''
        });
        
        return existingConversation.id;
      }
      
      // If no existing conversation, get other user's data
      let otherUserData;
      try {
        otherUserData = await getUserById(otherUserIdStr);
        console.log('Found other user:', otherUserData);
      } catch (err) {
        console.error('Error getting other user:', err);
        throw new Error('User not found');
      }
      
      if (!otherUserData) {
        console.error('Other user data is null or undefined');
        throw new Error('User not found');
      }
      
      // Create current user data object for Firebase
      const currentUserData = {
        id: myUserId,
        username: profile?.username || '',
        firstname: profile?.firstname || '',
        lastname: profile?.lastname || '',
        profilePicture: profile?.profilePicture || ''
      };
  
      const otherUser = {
        id: otherUserIdStr,
        username: otherUserData.username || '',
        firstname: otherUserData.firstname || '',
        lastname: otherUserData.lastname || '',
        profilePicture: otherUserData.profilePicture || ''
      };
  
      console.log('Creating conversation between:', currentUserData, otherUser);
    
      const conversationId = await getOrCreateConversation(
        myUserId, 
        otherUserIdStr,
        currentUserData,
        otherUser
      );
  
      console.log('Created/found conversation with ID:', conversationId);
  
      if (!conversationId) {
        throw new Error('Failed to create conversation - no ID returned');
      }
      
      // Select the conversation
      setCurrentConversation(conversationId);
      
      // Set the selected user for UI
      setSelectedUser({
        id: otherUserIdStr,
        name: `${otherUser.firstname || ''} ${otherUser.lastname || ''}`.trim() || otherUser.username || 'User',
        avatar: otherUser.profilePicture,
        username: otherUser.username
      });
      
      // Force reload of conversations
      setTimeout(() => {
        setLastRefresh(Date.now());
      }, 500);
      
      return conversationId;
    } catch (err) {
      console.error('Error starting conversation:', err);
      throw err;
    }
  };

  // Send a message in the current conversation
  const sendNewMessage = async (text) => {
    if (!currentConversation || !userId) {
      setError('Cannot send message');
      return false;
    }

    try {
      await sendMessage(currentConversation, {
        senderId: userId,
        senderName: profile ? 
          `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || profile.username : 
          'User',
        senderUsername: profile?.username || '',
        senderAvatar: profile?.profilePicture || '',
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

  // Edit a message
  const editMessage = async (conversationId, messageId, newText) => {
    if (!conversationId || !messageId || !userId) {
      setError('Cannot edit message');
      return false;
    }

    try {
      // Find the message to make sure it's our message
      const message = messages.find(m => m.id === messageId);
      
      if (!message) {
        console.error('Message not found for editing');
        return false;
      }
      
      if (message.senderId !== userId) {
        console.error('Cannot edit messages from other users');
        return false;
      }
      
      // Call Firebase function to update the message
      await updateMessage(conversationId, messageId, newText);
      
      return true;
    } catch (err) {
      console.error('Error editing message:', err);
      setError('Failed to edit message');
      return false;
    }
  };

  // Delete a message
  const deleteMessage = async (conversationId, messageId) => {
    if (!conversationId || !messageId || !userId) {
      setError('Cannot delete message');
      return false;
    }

    try {
      // Find the message to make sure it's our message
      const message = messages.find(m => m.id === messageId);
      
      if (!message) {
        console.error('Message not found for deletion');
        return false;
      }
      
      if (message.senderId !== userId) {
        console.error('Cannot delete messages from other users');
        return false;
      }
      
      // Call Firebase function to delete the message
      await firebaseDeleteMessage(conversationId, messageId);
      
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message');
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
      name: userData.name || conversation.otherUserName || 'User',
      avatar: userData.avatar || conversation.otherUserAvatar,
      username: userData.username || '',
      isOnline: conversation.isOtherUserOnline || false
    });
  }, []);



  const deleteCurrentConversation = async () => {
    if (!currentConversation) {
      setError('No conversation selected');
      return false;
    }
  
    try {
      await deleteConversation(currentConversation);
      
      // Update the conversations list
      setConversations(prev => 
        prev.filter(conv => conv.id !== currentConversation)
      );
      
      // Clear current conversation and selected user
      setCurrentConversation(null);
      setSelectedUser(null);
      
      return true;
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation');
      return false;
    }
  };

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
    editMessage,
    deleteMessage,
    setLastRefresh,
    deleteCurrentConversation
  };
};

export default useMessages;
