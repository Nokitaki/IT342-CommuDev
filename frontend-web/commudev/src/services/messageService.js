// src/services/messageService.js
import API_URL from '../config/apiConfig';

/**
 * Get all conversations for the current user
 * @returns {Promise<Array>} - Array of conversations
 */
export const getUserConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/conversations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const conversations = await response.json();
    
    // Format the conversations to match the structure expected by the UI
    return conversations.map(conv => ({
      id: conv.id.toString(),
      lastMessage: conv.lastMessage,
      lastSenderId: conv.lastSenderId ? conv.lastSenderId.toString() : null,
      lastUpdated: new Date(conv.lastUpdated),
      createdAt: new Date(conv.createdAt),
      otherUserId: conv.otherUserId ? conv.otherUserId.toString() : null,
      otherUserName: conv.otherUserName || 'User',
      otherUserAvatar: conv.otherUserAvatar,
      otherUsername: conv.otherUsername || '',
      unreadCount: conv.unreadCount || 0,
      isOtherUserOnline: false // We'll handle online status separately
    }));
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Get or create a conversation with another user
 * @param {string} otherUserId - The ID of the other user
 * @returns {Promise<string>} - Conversation ID
 */
export const getOrCreateConversation = async (otherUserId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: otherUserId })
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const conversation = await response.json();
    return conversation.id.toString();
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error;
  }
};

/**
 * Get messages for a conversation
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<Array>} - Array of messages
 */
export const getConversationMessages = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const messages = await response.json();
    
    // Format the messages to match the structure expected by the UI
    return messages.map(msg => ({
      id: msg.id.toString(),
      senderId: msg.senderId.toString(),
      senderName: msg.senderName,
      senderUsername: msg.senderUsername,
      senderAvatar: msg.senderAvatar,
      text: msg.text,
      timestamp: new Date(msg.timestamp),
      read: msg.read,
      edited: msg.edited,
      editedAt: msg.editedAt ? new Date(msg.editedAt) : null
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a message in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {object} messageData - Message data (text)
 * @returns {Promise<object>} - The sent message
 */
export const sendMessage = async (conversationId, messageData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/conversations/${conversationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const message = await response.json();
    
    // Format the message to match the structure expected by the UI
    return {
      id: message.id.toString(),
      senderId: message.senderId.toString(),
      senderName: message.senderName,
      senderUsername: message.senderUsername,
      senderAvatar: message.senderAvatar,
      text: message.text,
      timestamp: new Date(message.timestamp),
      read: message.read,
      edited: message.edited,
      editedAt: message.editedAt ? new Date(message.editedAt) : null
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Update a message
 * @param {string} messageId - ID of the message
 * @param {string} newText - New message text
 * @returns {Promise<object>} - The updated message
 */
export const updateMessage = async (messageId, newText) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: newText })
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const message = await response.json();
    
    // Format the message to match the structure expected by the UI
    return {
      id: message.id.toString(),
      senderId: message.senderId.toString(),
      senderName: message.senderName,
      senderUsername: message.senderUsername,
      senderAvatar: message.senderAvatar,
      text: message.text,
      timestamp: new Date(message.timestamp),
      read: message.read,
      edited: message.edited,
      editedAt: message.editedAt ? new Date(message.editedAt) : null
    };
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

/**
 * Delete a message
 * @param {string} messageId - ID of the message
 * @returns {Promise<boolean>} - Success status
 */
export const deleteMessage = async (messageId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

/**
 * Update typing status
 * @param {string} conversationId - ID of the conversation
 * @param {boolean} isTyping - Whether the user is typing
 * @returns {Promise<boolean>} - Success status
 */
export const updateTypingStatus = async (conversationId, isTyping) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/conversations/${conversationId}/typing`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isTyping })
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating typing status:', error);
    // Don't throw for typing status errors - they're not critical
    return false;
  }
};

/**
 * Get typing users for a conversation
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<Array>} - Array of user IDs who are typing
 */
export const getTypingUsers = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/conversations/${conversationId}/typing`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const typingUserIds = await response.json();
    
    // Convert IDs to strings
    return typingUserIds.map(id => id.toString());
  } catch (error) {
    console.error('Error getting typing users:', error);
    // Don't throw for typing status errors - they're not critical
    return [];
  }
};

/**
 * Delete a conversation
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<boolean>} - Success status
 */
export const deleteConversation = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/messages/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};



/**
 * Upload an image for a message
 * @param {File} file - Image file to upload
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<string>} - Promise with the image URL
 */
export const uploadMessageImage = async (file, conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);
    
    const response = await fetch(`${API_URL}/api/messages/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type here, browser will set it with correct boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading message image:', error);
    throw error;
  }
};

export default {
  getUserConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  updateTypingStatus,
  getTypingUsers,
  deleteConversation
};