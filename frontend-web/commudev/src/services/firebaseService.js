// src/services/firebaseService.js
// Refactored to use the centralized Firebase configuration

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  serverTimestamp,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  getDocs
} from 'firebase/firestore';

import { ref, onDisconnect, set, onValue } from 'firebase/database';

// Import centralized Firebase instances
import { firestore, realtimeDB, auth } from './firebase';

// Ensure we have the Firebase services
if (!firestore) {
  console.error("Firestore is not initialized!");
}

if (!realtimeDB) {
  console.error("Realtime Database is not initialized!");
}

/**
 * Send a message in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {object} message - Message object with sender, text, etc.
 * @returns {Promise} - Promise that resolves with the new message reference
 */


export const debugFirestore = async () => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    const conversationsRef = collection(firestore, 'conversations');
    const snapshot = await getDocs(conversationsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: doc.data().lastUpdated?.toDate(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error("Error debugging Firestore:", error);
    return [];
  }
};



export const sendMessage = async (conversationId, message) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
    
    const newMessage = {
      ...message,
      timestamp: serverTimestamp(),
      read: false
    };
    
    const messageDoc = await addDoc(messagesRef, newMessage);
    
    // Update the conversation with the last message
    const conversationRef = doc(firestore, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: newMessage.text,
      lastSenderId: newMessage.senderId,
      lastUpdated: serverTimestamp()
    });
    
    return messageDoc;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Get or create a conversation between two users
 * @param {string} user1Id - ID of the first user
 * @param {string} user2Id - ID of the second user
 * @param {object} user1Data - First user's data (name, avatar, etc.)
 * @param {object} user2Data - Second user's data (name, avatar, etc.)
 * @returns {string} - Conversation ID
 */
export const getOrCreateConversation = async (user1Id, user2Id, user1Data, user2Data) => {
  try {
    // Make sure Firebase is properly initialized
   if (!firestore) {
  console.warn('Firestore not initialized properly, using fallback');
  // Return a placeholder ID to prevent errors
  return `fallback_${Date.now()}`;
}

    // Check if user is signed in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('User not authenticated with Firebase - attempting to proceed anyway');
    }

    console.log('Getting or creating conversation between:', user1Id, user2Id);
    
    // Create a unique ID by sorting and joining user IDs
    const users = [user1Id, user2Id].sort();
    const conversationId = `${users[0]}_${users[1]}`;
    
    console.log('Conversation ID will be:', conversationId);
    
    // Check if conversation exists
    try {
      const conversationRef = doc(firestore, 'conversations', conversationId);
      const conversationSnap = await getDoc(conversationRef);
      
      if (conversationSnap.exists()) {
        console.log('Conversation already exists:', conversationId);
        return conversationId;
      }
    } catch (error) {
      console.error('Error checking if conversation exists:', error);
      throw error;
    }
    
    console.log('Creating new conversation with data:', user1Data, user2Data);
    
    // Store user information for easy access
    const userData = {};
    userData[user1Id] = {
      id: user1Id,
      username: user1Data.username || '',
      name: `${user1Data.firstname || ''} ${user1Data.lastname || ''}`.trim() || user1Data.username || 'User',
      avatar: user1Data.profilePicture
    };
    
    userData[user2Id] = {
      id: user2Id,
      username: user2Data.username || '',
      name: `${user2Data.firstname || ''} ${user2Data.lastname || ''}`.trim() || user2Data.username || 'User',
      avatar: user2Data.profilePicture
    };
    
    try {
      // Create the new conversation document
      const conversationRef = doc(firestore, 'conversations', conversationId);
      await setDoc(conversationRef, {
        participants: [user1Id, user2Id],
        userData: userData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        type: 'direct'
      });
      
      console.log('Conversation created successfully:', conversationId);
      return conversationId;
    } catch (docSetError) {
      console.error('Error setting conversation document:', docSetError);
      throw docSetError;
    }
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error;
  }
};

/**
 * Subscribe to messages in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {function} callback - Function to call with the messages
 * @returns {function} - Unsubscribe function
 */
export const subscribeToMessages = (conversationId, callback) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firebase timestamp to JS Date
        timestamp: doc.data().timestamp?.toDate()
      }));
      
      callback(messages);
    });
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    throw error;
  }
};

/**
 * Get all conversations for a user
 * @param {string} userId - ID of the user
 * @param {function} callback - Function to call with the conversations
 * @returns {function} - Unsubscribe function
 */
export const subscribeToUserConversations = (userId, callback) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    const conversationsRef = collection(firestore, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastUpdated', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => {
        const data = doc.data();
        const otherParticipantId = data.participants.find(id => id !== userId);
        const otherUserData = data.userData?.[otherParticipantId] || {};
        
        return {
          id: doc.id,
          ...data,
          otherUserId: otherParticipantId,
          otherUserName: otherUserData.name || 'User',
          otherUserAvatar: otherUserData.avatar || null,
          lastUpdated: data.lastUpdated?.toDate(),
          createdAt: data.createdAt?.toDate()
        };
      });
      
      callback(conversations);
    });
  } catch (error) {
    console.error('Error subscribing to conversations:', error);
    callback([]);
    return () => {};
  }
};

/**
 * Set up user presence
 * @param {string} userId - ID of the user to track presence for
 * @param {string} displayName - User's display name
 */
export const setupPresence = (userId, displayName) => {
  if (!userId) return;
  
  try {
    if (!realtimeDB) {
      console.error('Realtime Database not initialized');
      return;
    }
    
    const userStatusRef = ref(realtimeDB, `status/${userId}`);
    
    // When app disconnects, update the status to offline
    onDisconnect(userStatusRef).set({
      state: 'offline',
      lastSeen: serverTimestamp(),
      displayName
    });
    
    // When connected, update status to online
    set(userStatusRef, {
      state: 'online', 
      lastSeen: serverTimestamp(),
      displayName
    });
  } catch (error) {
    console.error('Error setting up presence:', error);
    // Continue without presence - don't let this break the app
  }
};

/**
 * Subscribe to a user's online status
 * @param {string} userId - ID of the user to check status
 * @param {function} callback - Function called with the status
 * @returns {function} - Unsubscribe function
 */
export const subscribeToUserPresence = (userId, callback) => {
  if (!userId) return () => {};
  
  try {
    if (!realtimeDB) {
      throw new Error("Realtime Database is not initialized");
    }

    const userStatusRef = ref(realtimeDB, `status/${userId}`);
    return onValue(userStatusRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || { state: 'offline' });
    });
  } catch (error) {
    console.error('Error subscribing to presence:', error);
    callback({ state: 'offline' });
    return () => {};
  }
};

/**
 * Mark messages as read
 * @param {string} conversationId - ID of the conversation
 * @param {string} currentUserId - ID of the current user
 */
export const markMessagesAsRead = async (conversationId, currentUserId) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    // Get unread messages not sent by current user
    const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
    const q = query(
      messagesRef, 
      where('read', '==', false),
      where('senderId', '!=', currentUserId)
    );
    
    const snapshot = await getDocs(q);
    
    // Update each message
    const batch = [];
    snapshot.docs.forEach(doc => {
      const messageRef = doc.ref;
      batch.push(updateDoc(messageRef, { read: true }));
    });
    
    await Promise.all(batch);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    // Don't rethrow - we don't want this to break the app flow
  }
};

/**
 * Update user typing status
 * @param {string} conversationId - ID of the conversation
 * @param {string} userId - ID of the user
 * @param {boolean} isTyping - Whether the user is typing
 */
export const updateTypingStatus = async (conversationId, userId, isTyping) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    const typingRef = doc(firestore, 'typing', conversationId);
    
    // Check if document exists
    const typingDoc = await getDoc(typingRef);
    
    // If typing, add user to typing list with timestamp
    if (isTyping) {
      // If document doesn't exist, create it
      if (!typingDoc.exists()) {
        await setDoc(typingRef, {
          [userId]: serverTimestamp()
        });
      } else {
        await updateDoc(typingRef, {
          [userId]: serverTimestamp()
        });
      }
    } 
    // If not typing, update only if document exists
    else if (typingDoc.exists()) {
      await updateDoc(typingRef, {
        [userId]: null
      });
    }
  } catch (error) {
    console.error('Error updating typing status:', error);
    // Don't throw - typing status updates should fail silently
  }
};

/**
 * Subscribe to typing status in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {string} currentUserId - ID of the current user
 * @param {function} callback - Function to call with typing users
 * @returns {function} - Unsubscribe function
 */
export const subscribeToTypingStatus = (conversationId, currentUserId, callback) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    const typingRef = doc(firestore, 'typing', conversationId);
    
    return onSnapshot(typingRef, (snapshot) => {
      const data = snapshot.data() || {};
      const now = new Date();
      
      // Find users who are typing (excluding current user)
      const typingUsers = Object.entries(data)
        .filter(([userId, timestamp]) => {
          // Filter out null timestamps and current user
          if (!timestamp || userId === currentUserId) return false;
          
          // Only consider recent typing events (last 5 seconds)
          const typingTime = timestamp.toDate();
          const timeDiff = now - typingTime;
          return timeDiff < 5000; // 5 seconds
        })
        .map(([userId]) => userId);
      
      callback(typingUsers);
    });
  } catch (error) {
    console.error('Error subscribing to typing status:', error);
    callback([]);
    return () => {}; // Return dummy unsubscribe function
  }
};



/**
 * Update a message in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {string} messageId - ID of the message to update
 * @param {string} newText - Updated message text
 * @returns {Promise<void>} - Promise that resolves when message is updated
 */
export const updateMessage = async (conversationId, messageId, newText) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    const messageRef = doc(firestore, 'conversations', conversationId, 'messages', messageId);
    
    // First check if the message exists
    const messageSnap = await getDoc(messageRef);
    if (!messageSnap.exists()) {
      throw new Error('Message not found');
    }
    
    // Update the message
    await updateDoc(messageRef, {
      text: newText,
      edited: true,
      editedAt: serverTimestamp()
    });
    
    // Update the conversation's lastMessage if this was the most recent message
    const conversationRef = doc(firestore, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (conversationSnap.exists()) {
      const conversationData = conversationSnap.data();
      const lastMessageId = conversationData.lastMessageId;
      
      // If this is the most recent message, update the conversation's lastMessage
      if (lastMessageId === messageId) {
        await updateDoc(conversationRef, {
          lastMessage: newText,
          lastUpdated: serverTimestamp()
        });
      }
    }
    
    console.log('Message updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

/**
 * Delete a message from a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {string} messageId - ID of the message to delete
 * @returns {Promise<void>} - Promise that resolves when message is deleted
 */
export const deleteMessage = async (conversationId, messageId) => {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }

    // Get the message to be deleted
    const messageRef = doc(firestore, 'conversations', conversationId, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);
    
    if (!messageSnap.exists()) {
      throw new Error('Message not found');
    }
    
    const messageData = messageSnap.data();
    
    // Delete the message document
    await deleteDoc(messageRef);
    
    // Update the conversation's lastMessage if this was the most recent message
    const conversationRef = doc(firestore, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (conversationSnap.exists()) {
      const conversationData = conversationSnap.data();
      const lastMessageId = conversationData.lastMessageId;
      
      // If this was the last message, we need to find the new last message
      if (lastMessageId === messageId) {
        // Get all messages and find the new most recent one
        const messagesQuery = await getCollectionWithQuery(
          collection(firestore, 'conversations', conversationId, 'messages'),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        
        if (messagesQuery.docs.length > 0) {
          const newLastMessage = messagesQuery.docs[0];
          const newLastMessageData = newLastMessage.data();
          
          // Update the conversation with the new last message
          await updateDoc(conversationRef, {
            lastMessage: newLastMessageData.text,
            lastMessageId: newLastMessage.id,
            lastSenderId: newLastMessageData.senderId,
            lastUpdated: newLastMessageData.timestamp
          });
        } else {
          // No messages left, update with empty values
          await updateDoc(conversationRef, {
            lastMessage: "No messages",
            lastMessageId: null,
            lastSenderId: null,
            lastUpdated: serverTimestamp()
          });
        }
      }
    }
    
    console.log('Message deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

export default {
  sendMessage, 
  getOrCreateConversation, 
  subscribeToMessages, 
  subscribeToUserConversations,
  setupPresence,
  subscribeToUserPresence,
  markMessagesAsRead,
  updateTypingStatus,
  subscribeToTypingStatus,
  updateMessage, 
  deleteMessage
};