// src/hooks/useMessages.js
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getUserConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
  updateMessage as updateMessageApi,
  deleteMessage as deleteMessageApi,
  updateTypingStatus as updateTypingApi,
  getTypingUsers as getTypingUsersApi,
  deleteConversation as deleteConversationApi
} from '../services/messageService';
import useProfile from './useProfile';
import { getUserById } from '../services/userService';

// How often to refresh data (in milliseconds)
const REFRESH_INTERVAL = 3000; // 3 seconds

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
  
  // References for interval timers
  const conversationsIntervalRef = useRef(null);
  const messagesIntervalRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Load user's conversations initially and on refresh
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await getUserConversations();
        setConversations(data);
        setError(null);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Failed to load conversations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchConversations();
    
    // Set up regular polling
    conversationsIntervalRef.current = setInterval(fetchConversations, REFRESH_INTERVAL);
    
    // Clean up
    return () => {
      if (conversationsIntervalRef.current) {
        clearInterval(conversationsIntervalRef.current);
      }
    };
  }, [lastRefresh]); // Re-fetch if lastRefresh changes

  // Load messages when conversation changes
  useEffect(() => {
    if (!currentConversation) {
      setMessages([]);
      return;
    }
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getConversationMessages(currentConversation);
        setMessages(data);
        setError(null);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMessages();
    
    // Set up regular polling
    messagesIntervalRef.current = setInterval(fetchMessages, REFRESH_INTERVAL);
    
    // Clean up
    return () => {
      if (messagesIntervalRef.current) {
        clearInterval(messagesIntervalRef.current);
      }
    };
  }, [currentConversation]);

  // Poll for typing status
  useEffect(() => {
    if (!currentConversation) {
      setTypingUsers([]);
      return;
    }
    
    const fetchTypingUsers = async () => {
      try {
        const typingUserIds = await getTypingUsersApi(currentConversation);
        setTypingUsers(typingUserIds);
      } catch (err) {
        console.error('Error fetching typing status:', err);
        // Non-critical, so just log the error
      }
    };

    // Initial fetch
    fetchTypingUsers();
    
    // Set up regular polling (more frequent for typing)
    typingIntervalRef.current = setInterval(fetchTypingUsers, 1000); // Poll every second
    
    // Clean up
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [currentConversation]);

  // Handle user typing status
  useEffect(() => {
    if (!currentConversation) {
      return;
    }
    
    if (isTyping) {
      // Send typing status to server
      updateTypingApi(currentConversation, true);
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing status after 5 seconds
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        updateTypingApi(currentConversation, false);
      }, 5000);
    } else {
      // Update server when typing stops
      updateTypingApi(currentConversation, false);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, currentConversation]);

  // Start or open a conversation with a user
  const startConversation = async (otherUserId) => {
    if (!profile?.id) {
      console.error("No user ID available, can't start conversation");
      throw new Error('You must be logged in to send messages');
    }
  
    try {
      console.log(`Starting conversation with user ${otherUserId}`);
      
      // Make sure otherUserId is a string
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
          username: existingConversation.otherUsername || ''
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
      
      // Create or get the conversation
      const conversationId = await getOrCreateConversation(otherUserIdStr);
      console.log('Created/found conversation with ID:', conversationId);
  
      if (!conversationId) {
        throw new Error('Failed to create conversation - no ID returned');
      }
      
      // Select the conversation
      setCurrentConversation(conversationId);
      
      // Set the selected user for UI
      setSelectedUser({
        id: otherUserIdStr,
        name: `${otherUserData.firstname || ''} ${otherUserData.lastname || ''}`.trim() || otherUserData.username || 'User',
        avatar: otherUserData.profilePicture,
        username: otherUserData.username
      });
      
      // Force reload of conversations
      setLastRefresh(Date.now());
      
      return conversationId;
    } catch (err) {
      console.error('Error starting conversation:', err);
      throw err;
    }
  };

  // Send a message in the current conversation
  const sendNewMessage = async (text) => {
    if (!currentConversation || !profile?.id) {
      setError('Cannot send message');
      return false;
    }

    try {
      const messageData = {
        text: text,
        // Note: Backend will get actual sender ID from authentication
      };
      
      await sendMessage(currentConversation, messageData);
      
      // Clear typing status after sending
      setIsTyping(false);
      
      // Refresh messages
      setLastRefresh(Date.now());
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return false;
    }
  };

  // Edit a message
  const editMessage = async (conversationId, messageId, newText) => {
    if (!conversationId || !messageId || !profile?.id) {
      setError('Cannot edit message');
      return false;
    }

    try {
      await updateMessageApi(messageId, newText);
      
      // Refresh messages
      setLastRefresh(Date.now());
      
      return true;
    } catch (err) {
      console.error('Error editing message:', err);
      setError('Failed to edit message');
      return false;
    }
  };

  // Delete a message
  const deleteMessageById = async (conversationId, messageId) => {
    if (!conversationId || !messageId || !profile?.id) {
      setError('Cannot delete message');
      return false;
    }

    try {
      await deleteMessageApi(messageId);
      
      // Refresh messages and conversations
      setLastRefresh(Date.now());
      
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
    setSelectedUser({
      id: conversation.otherUserId,
      name: conversation.otherUserName || 'User',
      avatar: conversation.otherUserAvatar,
      username: conversation.otherUsername || '',
      isOnline: conversation.isOtherUserOnline || false
    });
  }, []);

  // Delete the current conversation
  const deleteCurrentConversation = async () => {
    if (!currentConversation) {
      setError('No conversation selected');
      return false;
    }
  
    try {
      await deleteConversationApi(currentConversation);
      
      // Update the conversations list
      setConversations(prev => 
        prev.filter(conv => conv.id !== currentConversation)
      );
      
      // Clear current conversation and selected user
      setCurrentConversation(null);
      setSelectedUser(null);
      
      // Refresh the conversations list
      setLastRefresh(Date.now());
      
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
    deleteMessage: deleteMessageById,
    setLastRefresh,
    deleteCurrentConversation
  };
};

export default useMessages;