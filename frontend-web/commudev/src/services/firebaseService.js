// src/services/firebaseService.js
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
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
  arrayUnion,
  getDocs,
  limit
} from 'firebase/firestore';
import { getDatabase, ref, onDisconnect, set, onValue } from 'firebase/database';

// Your Firebase configuration - Replace with your own values from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyAIKlu3Pv6ywf3iPzlQ8Dx0dLq3FhM-4aU",
  authDomain: "commudev-26875.firebaseapp.com",
  projectId: "commudev-26875",
  storageBucket: "commudev-26875.firebasestorage.app",
  messagingSenderId: "497152523487",
  appId: "1:497152523487:web:0c35bc99d8d47458ecfd6a",
  measurementId: "G-12TGZG3GKK"
};


// Flag to determine if we should use Firebase or mock implementations
// Set to false for local testing without Firebase
const USE_FIREBASE = true;

// Initialize Firebase if we're using it
let app, db, rtdb;
if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    rtdb = getDatabase(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// Local storage for mock implementations
const localStore = {
  conversations: {},
  messages: {},
  typing: {},
  presence: {}
};

/**
 * Send a message in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {object} message - Message object with sender, text, etc.
 * @returns {Promise} - Promise that resolves with the new message reference
 */
export const sendMessage = async (conversationId, message) => {
  if (USE_FIREBASE) {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      
      const newMessage = {
        ...message,
        timestamp: serverTimestamp(),
        read: false
      };
      
      const messageDoc = await addDoc(messagesRef, newMessage);
      
      // Update the conversation with the last message
      const conversationRef = doc(db, 'conversations', conversationId);
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
  } else {
    // Mock implementation
    try {
      // Initialize conversation and messages if they don't exist
      if (!localStore.conversations[conversationId]) {
        localStore.conversations[conversationId] = {
          id: conversationId,
          lastMessage: '',
          lastSenderId: '',
          lastUpdated: new Date()
        };
      }
      if (!localStore.messages[conversationId]) {
        localStore.messages[conversationId] = [];
      }
      
      // Create new message
      const newMessage = {
        ...message,
        id: `msg_${Date.now()}${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date(),
        read: false
      };
      
      // Add to messages
      localStore.messages[conversationId].push(newMessage);
      
      // Update conversation
      localStore.conversations[conversationId].lastMessage = newMessage.text;
      localStore.conversations[conversationId].lastSenderId = newMessage.senderId;
      localStore.conversations[conversationId].lastUpdated = new Date();
      
      console.log('Mock: Message sent', newMessage);
      return { id: newMessage.id };
    } catch (error) {
      console.error('Error in mock sendMessage:', error);
      throw error;
    }
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
  if (USE_FIREBASE) {
    try {
      console.log('Getting or creating conversation between:', user1Id, user2Id);
      
      // Create a unique ID by sorting and joining user IDs
      const users = [user1Id, user2Id].sort();
      const conversationId = `${users[0]}_${users[1]}`;
      
      console.log('Conversation ID will be:', conversationId);
      
      // Check if conversation exists
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationSnap = await getDoc(conversationRef);
      
      if (conversationSnap.exists()) {
        console.log('Conversation already exists:', conversationId);
        return conversationId;
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
      
      // Create conversation document
      await setDoc(conversationRef, {
        participants: [user1Id, user2Id],
        userData: userData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        type: 'direct'
      });
      
      console.log('Conversation created successfully:', conversationId);
      return conversationId;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw error;
    }
  } else {
    // Mock implementation
    try {
      console.log('Mock: Getting or creating conversation between:', user1Id, user2Id);
      
      // Create a unique ID by sorting and joining user IDs
      const users = [user1Id, user2Id].sort();
      const conversationId = `${users[0]}_${users[1]}`;
      
      console.log('Mock: Conversation ID will be:', conversationId);
      
      // Check if conversation exists
      if (localStore.conversations[conversationId]) {
        console.log('Mock: Conversation already exists:', conversationId);
        return conversationId;
      }
      
      console.log('Mock: Creating new conversation with data:', user1Data, user2Data);
      
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
      
      // Create conversation object
      localStore.conversations[conversationId] = {
        id: conversationId,
        participants: [user1Id, user2Id],
        userData: userData,
        createdAt: new Date(),
        lastUpdated: new Date(),
        type: 'direct',
        // Also add properties needed for our mock subscription
        otherUserId: user2Id,
        otherUserName: userData[user2Id].name,
        otherUserAvatar: userData[user2Id].avatar,
        lastMessage: 'Start a conversation'
      };
      
      // Initialize messages array for this conversation
      localStore.messages[conversationId] = [];
      
      console.log('Mock: Conversation created successfully:', conversationId);
      return conversationId;
    } catch (error) {
      console.error('Error in mock getOrCreateConversation:', error);
      throw error;
    }
  }
};

/**
 * Subscribe to messages in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {function} callback - Function to call with the messages
 * @returns {function} - Unsubscribe function
 */
export const subscribeToMessages = (conversationId, callback) => {
  if (USE_FIREBASE) {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
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
  } else {
    // Mock implementation
    console.log('Mock: Subscribing to messages for', conversationId);
    
    // Initialize if needed
    if (!localStore.messages[conversationId]) {
      localStore.messages[conversationId] = [];
    }
    
    // Initial callback with current messages
    callback(localStore.messages[conversationId] || []);
    
    // Set up periodic checking for new messages (simulating real-time updates)
    const intervalId = setInterval(() => {
      callback(localStore.messages[conversationId] || []);
    }, 1000);
    
    // Return unsubscribe function
    return () => {
      clearInterval(intervalId);
      console.log('Mock: Unsubscribed from messages for', conversationId);
    };
  }
};

/**
 * Get all conversations for a user
 * @param {string} userId - ID of the user
 * @param {function} callback - Function to call with the conversations
 * @returns {function} - Unsubscribe function
 */
export const subscribeToUserConversations = (userId, callback) => {
  if (USE_FIREBASE) {
    try {
      const conversationsRef = collection(db, 'conversations');
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
      throw error;
    }
  } else {
    // Mock implementation
    console.log('Mock: Subscribing to conversations for user', userId);
    
    // Get all conversations where this user is a participant
    const userConversations = Object.values(localStore.conversations)
      .filter(conv => {
        // If it has participants field, check array
        if (conv.participants && Array.isArray(conv.participants)) {
          return conv.participants.includes(userId);
        }
        
        // For mock conversations with otherUserId directly (from our custom code)
        const [user1, user2] = conv.id.split('_');
        return user1 === userId || user2 === userId;
      })
      .map(conv => {
        // If this is a mock conversation with just an ID like "user1_user2"
        if (!conv.participants) {
          const [user1, user2] = conv.id.split('_');
          const otherUserId = user1 === userId ? user2 : user1;
          
          return {
            ...conv,
            participants: [user1, user2],
            otherUserId: otherUserId,
            otherUserName: conv.otherUserName || 'User',
            otherUserAvatar: conv.otherUserAvatar || null,
            lastUpdated: conv.lastUpdated || new Date(),
            createdAt: conv.createdAt || new Date()
          };
        }
        
        // For regular Firebase-like data model
        const otherParticipantId = conv.participants.find(id => id !== userId);
        const otherUserData = conv.userData?.[otherParticipantId] || {};
        
        return {
          ...conv,
          otherUserId: otherParticipantId,
          otherUserName: otherUserData.name || conv.otherUserName || 'User',
          otherUserAvatar: otherUserData.avatar || conv.otherUserAvatar || null,
          lastUpdated: conv.lastUpdated || new Date(),
          createdAt: conv.createdAt || new Date()
        };
      })
      .sort((a, b) => b.lastUpdated - a.lastUpdated);
    
    // Initial callback
    callback(userConversations);
    
    // Set up interval to periodically check for updates
    const intervalId = setInterval(() => {
      // Repeat the filter/map process to get latest conversations
      const updatedConversations = Object.values(localStore.conversations)
        .filter(conv => {
          if (conv.participants && Array.isArray(conv.participants)) {
            return conv.participants.includes(userId);
          }
          const [user1, user2] = conv.id.split('_');
          return user1 === userId || user2 === userId;
        })
        .map(conv => {
          if (!conv.participants) {
            const [user1, user2] = conv.id.split('_');
            const otherUserId = user1 === userId ? user2 : user1;
            
            return {
              ...conv,
              participants: [user1, user2],
              otherUserId: otherUserId,
              otherUserName: conv.otherUserName || 'User',
              otherUserAvatar: conv.otherUserAvatar || null,
              lastUpdated: conv.lastUpdated || new Date(),
              createdAt: conv.createdAt || new Date()
            };
          }
          
          const otherParticipantId = conv.participants.find(id => id !== userId);
          const otherUserData = conv.userData?.[otherParticipantId] || {};
          
          return {
            ...conv,
            otherUserId: otherParticipantId,
            otherUserName: otherUserData.name || conv.otherUserName || 'User',
            otherUserAvatar: otherUserData.avatar || conv.otherUserAvatar || null,
            lastUpdated: conv.lastUpdated || new Date(),
            createdAt: conv.createdAt || new Date()
          };
        })
        .sort((a, b) => b.lastUpdated - a.lastUpdated);
      
      callback(updatedConversations);
    }, 1000);
    
    // Return unsubscribe function
    return () => {
      clearInterval(intervalId);
      console.log('Mock: Unsubscribed from conversations for user', userId);
    };
  }
};

/**
 * Set up user presence
 * @param {string} userId - ID of the user to track presence for
 * @param {string} displayName - User's display name
 */
export const setupPresence = (userId, displayName) => {
  if (!userId) return;
  
  if (USE_FIREBASE) {
    const userStatusRef = ref(rtdb, `status/${userId}`);
    
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
  } else {
    // Mock implementation
    console.log('Mock: Setting up presence for user', userId);
    
    // Set user as online in local store
    localStore.presence[userId] = {
      state: 'online',
      lastSeen: new Date(),
      displayName
    };
    
    // Set up window beforeunload event to simulate disconnection
    window.addEventListener('beforeunload', () => {
      localStore.presence[userId] = {
        state: 'offline',
        lastSeen: new Date(),
        displayName
      };
    });
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
  
  if (USE_FIREBASE) {
    const userStatusRef = ref(rtdb, `status/${userId}`);
    return onValue(userStatusRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || { state: 'offline' });
    });
  } else {
    // Mock implementation
    console.log('Mock: Subscribing to presence for user', userId);
    
    // Initial callback with current status
    const status = localStore.presence[userId] || { state: 'offline' };
    callback(status);
    
    // Set up interval to check for updates
    const intervalId = setInterval(() => {
      const currentStatus = localStore.presence[userId] || { state: 'offline' };
      callback(currentStatus);
    }, 5000);
    
    // Return unsubscribe function
    return () => {
      clearInterval(intervalId);
      console.log('Mock: Unsubscribed from presence for user', userId);
    };
  }
};

/**
 * Mark messages as read
 * @param {string} conversationId - ID of the conversation
 * @param {string} currentUserId - ID of the current user
 */
export const markMessagesAsRead = async (conversationId, currentUserId) => {
  if (USE_FIREBASE) {
    try {
      // Get unread messages not sent by current user
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
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
      throw error;
    }
  } else {
    // Mock implementation
    try {
      console.log('Mock: Marking messages as read in conversation', conversationId);
      
      // Get messages for this conversation
      if (!localStore.messages[conversationId]) {
        return; // No messages to mark
      }
      
      // Update unread messages not sent by current user
      localStore.messages[conversationId] = localStore.messages[conversationId].map(msg => {
        if (!msg.read && msg.senderId !== currentUserId) {
          return { ...msg, read: true };
        }
        return msg;
      });
    } catch (error) {
      console.error('Error in mock markMessagesAsRead:', error);
      throw error;
    }
  }
};

/**
 * Create a group conversation
 * @param {string} name - Name of the group
 * @param {array} participantIds - Array of user IDs in the group
 * @param {object} participantsData - Object with user data keyed by user ID
 * @param {string} creatorId - ID of the user creating the group
 * @returns {string} - Conversation ID
 */
export const createGroupConversation = async (name, participantIds, participantsData, creatorId) => {
  try {
    // Create user data object for the conversation
    const userData = {};
    participantIds.forEach(id => {
      const user = participantsData[id];
      userData[id] = {
        id: id,
        username: user.username,
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        avatar: user.profilePicture
      };
    });
    
    const conversationRef = doc(collection(db, 'conversations'));
    await setDoc(conversationRef, {
      type: 'group',
      name: name,
      participants: participantIds,
      userData: userData,
      createdBy: creatorId,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    });
    
    return conversationRef.id;
  } catch (error) {
    console.error('Error creating group conversation:', error);
    throw error;
  }
};

/**
 * Update user typing status
 * @param {string} conversationId - ID of the conversation
 * @param {string} userId - ID of the user
 * @param {boolean} isTyping - Whether the user is typing
 */
export const updateTypingStatus = async (conversationId, userId, isTyping) => {
  if (USE_FIREBASE) {
    try {
      const typingRef = doc(db, 'typing', conversationId);
      
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
  } else {
    // Your existing mock implementation
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
  if (USE_FIREBASE) {
    try {
      const typingRef = doc(db, 'typing', conversationId);
      
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
      return () => {}; // Return dummy unsubscribe function
    }
  } else {
    // Mock implementation
    console.log('Mock: Subscribing to typing status for', conversationId);
    
    // Initialize if needed
    if (!localStore.typing[conversationId]) {
      localStore.typing[conversationId] = {};
    }
    
    // Initial callback with current typing users
    const now = new Date();
    const typingUsers = Object.entries(localStore.typing[conversationId] || {})
      .filter(([userId, timestamp]) => {
        if (!timestamp || userId === currentUserId) return false;
        const timeDiff = now - timestamp;
        return timeDiff < 5000; // 5 seconds
      })
      .map(([userId]) => userId);
    
    callback(typingUsers);
    
    // Set up interval to check for updates
    const intervalId = setInterval(() => {
      const currentNow = new Date();
      const currentTypingUsers = Object.entries(localStore.typing[conversationId] || {})
        .filter(([userId, timestamp]) => {
          if (!timestamp || userId === currentUserId) return false;
          const timeDiff = currentNow - timestamp;
          return timeDiff < 5000; // 5 seconds
        })
        .map(([userId]) => userId);
      
      callback(currentTypingUsers);
    }, 1000);
    
    // Return unsubscribe function
    return () => {
      clearInterval(intervalId);
      console.log('Mock: Unsubscribed from typing status for', conversationId);
    };
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
  createGroupConversation,
  updateTypingStatus,
  subscribeToTypingStatus
};