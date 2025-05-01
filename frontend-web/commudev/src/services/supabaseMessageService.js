// src/services/supabaseMessageService.js
import { supabase } from './supabase';
import { getUserById } from './userService';

/**
 * Send a message in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {object} message - Message object with sender, text, etc.
 * @returns {Promise} - Promise that resolves with the new message reference
 */
export const sendMessage = async (conversationId, message) => {
  try {
    // Insert the message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: message.senderId,
        sender_name: message.senderName,
        sender_username: message.senderUsername,
        sender_avatar: message.senderAvatar,
        text: message.text,
        is_read: false
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Update the conversation with the last message
    const { error: convError } = await supabase
      .from('conversations')
      .update({
        last_message: message.text,
        last_sender_id: message.senderId,
        last_updated: new Date().toISOString()
      })
      .eq('id', conversationId);

    if (convError) throw convError;

    return messageData;
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
    // Check if a conversation already exists between these users
    const { data: participants, error: participantsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .in('user_id', [user1Id, user2Id])
      .order('conversation_id');

    if (participantsError) throw participantsError;

    // Group by conversation_id to find conversations with both users
    const conversationCounts = {};
    participants.forEach(p => {
      conversationCounts[p.conversation_id] = (conversationCounts[p.conversation_id] || 0) + 1;
    });

    // Find conversation IDs that have both users
    const sharedConversationIds = Object.entries(conversationCounts)
      .filter(([_, count]) => count >= 2)
      .map(([id, _]) => id);

    // If shared conversation exists, return the first one
    if (sharedConversationIds.length > 0) {
      return sharedConversationIds[0];
    }

    // If no conversation exists, create a new one
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (conversationError) throw conversationError;

    // Add both users to the conversation
    const { error: participantsInsertError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversation.id, user_id: user1Id },
        { conversation_id: conversation.id, user_id: user2Id }
      ]);

    if (participantsInsertError) throw participantsInsertError;

    return conversation.id;
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
    // First fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        callback([]);
        return;
      }

      // Format messages to match the structure expected by the UI
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.sender_name,
        senderUsername: msg.sender_username,
        senderAvatar: msg.sender_avatar,
        text: msg.text,
        timestamp: new Date(msg.timestamp),
        read: msg.is_read,
        edited: msg.is_edited,
        editedAt: msg.edited_at ? new Date(msg.edited_at) : null
      }));

      callback(formattedMessages);
    };

    // Fetch initial messages
    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, () => {
        // Refresh messages when there's a change
        fetchMessages();
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    callback([]);
    return () => {}; // Return empty unsubscribe function on error
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
    const fetchConversations = async () => {
      // Get all conversation IDs the user is part of
      const { data: userConversations, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

      if (participantsError) {
        console.error('Error fetching user conversations:', participantsError);
        callback([]);
        return;
      }

      if (!userConversations || userConversations.length === 0) {
        callback([]);
        return;
      }

      const conversationIds = userConversations.map(c => c.conversation_id);

      // Get all conversations
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('last_updated', { ascending: false });

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
        callback([]);
        return;
      }

      // For each conversation, get the other participant
      const result = await Promise.all(conversations.map(async (conversation) => {
        // Get participants for this conversation
        const { data: participants, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conversation.id);

        if (participantsError) {
          console.error('Error fetching participants:', participantsError);
          return null;
        }

        // Find the other user ID
        const otherUserId = participants
          .map(p => p.user_id)
          .find(id => id !== userId);

        if (!otherUserId) {
          return null;
        }

        // Get other user data from your existing user service
        let otherUserData = null;
        try {
          otherUserData = await getUserById(otherUserId);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }

        // Count unread messages
        const { count, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact' })
          .eq('conversation_id', conversation.id)
          .eq('sender_id', otherUserId)
          .eq('is_read', false);

        if (countError) {
          console.error('Error counting unread messages:', countError);
        }

        // Get user's online status from presence
        const { data: presenceData } = await supabase
          .from('user_presence')
          .select('status')
          .eq('user_id', otherUserId)
          .single();

        const isOnline = presenceData?.status === 'online';

        // Format the conversation to match the structure expected by the UI
        return {
          id: conversation.id,
          lastMessage: conversation.last_message,
          lastSenderId: conversation.last_sender_id,
          lastUpdated: new Date(conversation.last_updated),
          createdAt: new Date(conversation.created_at),
          otherUserId: otherUserId,
          otherUserName: otherUserData ? 
            `${otherUserData.firstname || ''} ${otherUserData.lastname || ''}`.trim() || otherUserData.username : 
            'User',
          otherUserAvatar: otherUserData?.profilePicture || null,
          otherUsername: otherUserData?.username || '',
          unreadCount: count || 0,
          isOtherUserOnline: isOnline
        };
      }));

      // Filter out null values (conversations that couldn't be processed)
      const validConversations = result.filter(conv => conv !== null);
      callback(validConversations);
    };

    // Fetch initial conversations
    fetchConversations();

    // Subscribe to changes in conversations and messages
    const channel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations'
      }, () => {
        fetchConversations();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        fetchConversations();
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error subscribing to conversations:', error);
    callback([]);
    return () => {}; // Return empty unsubscribe function on error
  }
};

/**
 * Set up user presence
 * @param {string} userId - ID of the user to track presence for
 * @param {string} displayName - User's display name
 */
export const setupPresence = async (userId, displayName) => {
  if (!userId) return;

  try {
    // Update user presence status to online
    const { error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: userId,
        status: 'online',
        last_seen: new Date().toISOString(),
        display_name: displayName
      });

    if (error) throw error;

    // Setup function to handle user going offline
    const handleTabClose = async () => {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          status: 'offline',
          last_seen: new Date().toISOString(),
          display_name: displayName
        });
    };

    // Add event listeners for page visibility and beforeunload
    window.addEventListener('beforeunload', handleTabClose);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      handleTabClose();
    };
  } catch (error) {
    console.error('Error setting up presence:', error);
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
    // First get current status
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user presence:', error);
        callback({ state: 'offline' });
        return;
      }

      callback({
        state: data.status,
        lastSeen: new Date(data.last_seen),
        displayName: data.display_name
      });
    };

    // Fetch initial status
    fetchStatus();

    // Subscribe to changes
    const channel = supabase
      .channel(`presence:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_presence',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchStatus();
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
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
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', currentUserId)
      .eq('is_read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking messages as read:', error);
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
    const { error } = await supabase
      .from('typing_status')
      .upsert({
        conversation_id: conversationId,
        user_id: userId,
        is_typing: isTyping,
        timestamp: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating typing status:', error);
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
    const fetchTypingUsers = async () => {
      const { data, error } = await supabase
        .from('typing_status')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('is_typing', true);

      if (error) {
        console.error('Error fetching typing status:', error);
        callback([]);
        return;
      }

      const now = new Date();
      // Filter out stale typing indicators (older than 5 seconds) and current user
      const typingUsers = data
        .filter(status => {
          const typingTime = new Date(status.timestamp);
          const timeDiff = now - typingTime;
          return status.user_id !== currentUserId && timeDiff < 5000; // 5 seconds
        })
        .map(status => status.user_id);

      callback(typingUsers);
    };

    // Fetch initial typing status
    fetchTypingUsers();

    // Subscribe to changes
    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'typing_status',
        filter: `conversation_id=eq.${conversationId}`
      }, () => {
        fetchTypingUsers();
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error subscribing to typing status:', error);
    callback([]);
    return () => {};
  }
};

/**
 * Update a message in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {string} messageId - ID of the message to update
 * @param {string} newText - Updated message text
 * @returns {Promise<boolean>} - Promise that resolves when message is updated
 */
export const updateMessage = async (conversationId, messageId, newText) => {
  try {
    // Update the message
    const { data, error } = await supabase
      .from('messages')
      .update({
        text: newText,
        is_edited: true,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;

    // Check if this is the last message in the conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('last_message, last_sender_id')
      .eq('id', conversationId)
      .single();

    if (convError) throw convError;

    // Update the conversation's last message if needed
    if (conversation.last_sender_id === data.sender_id) {
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: newText,
          last_updated: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (updateError) throw updateError;
    }

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
 * @returns {Promise<boolean>} - Promise that resolves when message is deleted
 */
export const deleteMessage = async (conversationId, messageId) => {
  try {
    // First get the message to check if it's the last message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (messageError) throw messageError;

    // Delete the message
    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (deleteError) throw deleteError;

    // Check if we need to update the conversation's last message
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('last_message, last_sender_id')
      .eq('id', conversationId)
      .single();

    if (convError) throw convError;

    // If the deleted message was the last message, find the new last message
    if (conversation.last_message === message.text && 
        conversation.last_sender_id === message.sender_id) {
      // Get the new most recent message
      const { data: lastMessages, error: lastMessageError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (lastMessageError) throw lastMessageError;

      // Update conversation with new last message or empty if none
      const updateData = lastMessages && lastMessages.length > 0
        ? {
            last_message: lastMessages[0].text,
            last_sender_id: lastMessages[0].sender_id,
            last_updated: new Date().toISOString()
          }
        : {
            last_message: 'No messages',
            last_sender_id: null,
            last_updated: new Date().toISOString()
          };

      const { error: updateError } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId);

      if (updateError) throw updateError;
    }

    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

/**
 * Delete a conversation and all its messages
 * @param {string} conversationId - ID of the conversation to delete
 * @returns {Promise<boolean>} - Promise that resolves when conversation is deleted
 */
export const deleteConversation = async (conversationId) => {
  try {
    // With proper foreign key constraints, deleting the conversation
    // should cascade and delete all messages and participants
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
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
  deleteMessage,
  deleteConversation
};