// src/pages/messages/EnhancedMessagesPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Image, 
  Mic, 
  Phone, 
  Video, 
  MoreVertical, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import MessageLayout from "../../layouts/MessagesLayout";
import useMessages from "../../hooks/useMessages";
import useProfile from "../../hooks/useProfile";
import Avatar from "../../components/common/Avatar";
import NewMessageModal from '../../components/modals/NewMessageModal';
import { formatTimeAgo } from "../../utils/dateUtils";
import "../../styles/pages/messages.css";
import EmojiPicker from 'emoji-picker-react';
import API_URL from '../../config/apiConfig';


// Import your logo
import LogoIcon from "../../../public/assets/images/logo.png";

const MessagesPage = () => {
  const { 
    conversations, 
    messages, 
    currentConversation, 
    selectedUser,
    typingUsers,
    loading, 
    error, 
    selectConversation, 
    sendNewMessage, 
    handleTypingInput,
    startConversation,
    setLastRefresh,
    editMessage,
    deleteMessage,
    deleteCurrentConversation
  } = useMessages();
  
  const { profile } = useProfile();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessageText, setEditedMessageText] = useState("");
  const [messageActionsId, setMessageActionsId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null);
  
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const messageInputRef = useRef(null);


  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  




  const toggleOptionsMenu = (e) => {
    e.stopPropagation();
    setShowOptionsMenu(prev => !prev);
  };




  

  const handleImageSelect = () => {
    fileInputRef.current.click();
  };
  
  // Add this function to process the selected file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      // Create a preview message with the image
      const imageUrl = URL.createObjectURL(file);
      setNewMessage(`[Image: ${file.name}]`);
      // You can optionally show a preview here
    } else {
      alert('Please select a valid image file');
    }
  };





  
  // Handle delete conversation
  const handleDeleteConversation = async () => {
    setShowDeleteConfirm(false);
    setShowOptionsMenu(false);
    
    try {
      const success = await deleteCurrentConversation();
      if (success) {
        // Maybe show a temporary success message
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };


  const handleEmojiSelect = (emojiData) => {
    const emoji = emojiData.emoji;
    const newText = newMessage.slice(0, cursorPosition) + emoji + newMessage.slice(cursorPosition);
    setNewMessage(newText);
    
    // Close the emoji picker
    setShowEmojiPicker(false);
    
    // Focus back on the input and set cursor position after emoji
    if (messageInputRef.current) {
      messageInputRef.current.focus();
      const newCursorPosition = cursorPosition + emoji.length;
      messageInputRef.current.selectionStart = newCursorPosition;
      messageInputRef.current.selectionEnd = newCursorPosition;
      setCursorPosition(newCursorPosition);
    }
  };


  const handleInputClick = (e) => {
    setCursorPosition(e.target.selectionStart);
  };
  
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setCursorPosition(e.target.selectionStart);
    handleTypingInput();
  };




  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  // Auto focus when editing a message
  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessageId]);


  // Add this useEffect to close the emoji picker when clicking outside
useEffect(() => {
  const handleClickOutside = (e) => {
    if (showEmojiPicker && !e.target.closest('.emoji-picker-container') && 
        !e.target.closest('.input-action[title="Emoji"]')) {
      setShowEmojiPicker(false);
    }
  };

  
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showEmojiPicker]);
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const otherUserName = conv.otherUserName ? conv.otherUserName.toLowerCase() : '';
    
    return otherUserName.includes(searchLower);
  });

  // Handle send message
  const handleSendMessage = async () => {
    if ((newMessage.trim() === "" && !selectedImage) || !currentConversation || isSending) return;
    
    setIsSending(true);
    
    try {
      let success;
      
      // Create message object
      const messageData = {
        senderId: profile?.id?.toString(),
        senderName: profile ? 
          `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || profile.username : 
          'User',
        senderUsername: profile?.username || '',
        senderAvatar: profile?.profilePicture || '',
        text: newMessage.trim()
      };
      
      if (selectedImage) {
        // Send message with image
        success = await sendNewMessage(messageData.text || "📷", selectedImage);
        setSelectedImage(null);
      } else {
        // Send text-only message
        success = await sendNewMessage(messageData.text);
      }
      
      if (success) {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle editing a message
  const handleStartEditing = (message) => {
    setEditingMessageId(message.id);
    setEditedMessageText(message.text);
    setMessageActionsId(null); // Close action menu
  };
  
  // Save edited message
  const handleSaveEdit = async () => {
    if (editedMessageText.trim() === "" || !editingMessageId) return;
    
    try {
      const success = await editMessage(currentConversation, editingMessageId, editedMessageText);
      if (success) {
        setEditingMessageId(null);
        setEditedMessageText("");
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessageText("");
  };
  
  // Delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      const success = await deleteMessage(currentConversation, messageId);
      if (success) {
        setMessageActionsId(null);
        setConfirmDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  
  // Confirm delete
  const showDeleteConfirmation = (messageId) => {
    setConfirmDeleteId(messageId);
  };
  
  // Hide delete confirmation
  const hideDeleteConfirmation = () => {
    setConfirmDeleteId(null);
  };
  
  // Toggle message actions menu
  const toggleMessageActions = (messageId) => {
    if (messageActionsId === messageId) {
      setMessageActionsId(null);
    } else {
      setMessageActionsId(messageId);
    }
  };
  
  // Close message actions when clicking anywhere else
  useEffect(() => {
    const handleOutsideClick = () => {
      setMessageActionsId(null);
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);
  
  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    handleTypingInput();
  };

  // Start a new conversation with a user
  const handleStartConversation = async (user) => {
    try {
      if (!user || !user.id) {
        console.error('Invalid user object:', user);
        return;
      }
      
      // Show loading state
      setIsSending(true);
      
      // Check if we have a profile
      if (!profile || !profile.id) {
        console.error('Current user profile is not loaded');
        alert("Please wait while your profile is loading or try refreshing the page.");
        setIsSending(false);
        return;
      }
      
      try {
        // Convert user.id to string to ensure compatibility
        const conversationId = await startConversation(user.id.toString());
        
        if (conversationId) {
          setShowNewMessageModal(false);
          
          // Force refresh conversation list
          setTimeout(() => {
            setLastRefresh(Date.now());
          }, 500);
        } else {
          alert("There was a problem starting the conversation. Please try again later.");
        }
      } catch (error) {
        console.error("Error from startConversation:", error);
        
        // Check for specific errors to provide better user feedback
        if (error.message && error.message.includes('not authenticated')) {
          alert("You need to log in again to use messaging. Please log out and log back in.");
        } else if (error.message && error.message.includes('not initialized')) {
          alert("The messaging system is currently unavailable. Please try again later.");
        } else {
          alert("Could not start the conversation. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error in handleStartConversation:", error);
      alert("Error starting conversation: " + (error.message || "Unknown error"));
    } finally {
      setIsSending(false);
    }
  };

  // Get user's avatar with fallback
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/src/assets/images/profile/default-avatar.png';
    
    return avatarPath.startsWith('http') 
      ? avatarPath 
      : `${API_URL}${avatarPath}`;
  };
  
  // Format date for messages
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Left sidebar content - Conversations List
  const LeftSidebar = (
    <div className="conversations-sidebar">
      <div className="conversations-header">
        <Link to="/" className="logo-link">
          <img src={LogoIcon} alt="Logo" className="logo-icon" />
        </Link>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search conversations"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="search-icon" />
        </div>
        <button className="new-message-button" onClick={() => setShowNewMessageModal(true)}>
          <UserPlus size={20} />
          <span>New Chat</span>
        </button>
      </div>
  
      <div className="conversations-list">
        {loading && conversations.length === 0 ? (
          <div className="loading-message">Loading conversations...</div>
        ) : filteredConversations.length === 0 ? (
          <div className="no-conversations">
            {searchTerm ? 'No matching conversations' : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${currentConversation === conversation.id ? "active" : ""}`}
              onClick={() => selectConversation(conversation)}
            >
              <div className="user-avatar">
                <img 
                  src={getAvatarUrl(conversation.otherUserAvatar)}
                  alt={conversation.otherUserName || "User"}
                  className="avatar-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/images/profile/default-avatar.png';
                  }}
                />
                {/* Online status indicator - this would need to be implemented in your Firebase presence system */}
                {conversation.isOnline && <span className="online-indicator"></span>}
              </div>
              <div className="conversation-info">
                <h3 className="m-user-name">{conversation.otherUserName || "User"}</h3>
                <p className="last-message">
                  {conversation.lastSenderId === profile?.id?.toString() ? "You: " : ""}
                  {conversation.lastMessage || "No messages yet"}
                </p>
              </div>
              <div className="conversation-meta">
                <span className="conversation-time">
                  {conversation.lastUpdated ? formatTimeAgo(conversation.lastUpdated) : ''}
                </span>
                {conversation.unreadCount > 0 && (
                  <span className="unread-count">{conversation.unreadCount}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Main chat content
  const ChatContent = (
    <>
      {currentConversation && selectedUser ? (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-user-info">
              <img
                src={getAvatarUrl(selectedUser.avatar)}
                alt={selectedUser.name}
                className="chat-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/images/profile/default-avatar.png';
                }}
              />
              <div className="chat-user-details">
                <h2 className="chat-user-name">{selectedUser.name}</h2>
                <p className="chat-user-status">
                  {/* Status indicator */}
                  <span className={`status-indicator ${selectedUser.isOnline ? "online" : "offline"}`}></span>
                  {selectedUser.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="chat-actions">
                  <button className="action-btn" title="Voice call">
                    <Phone size={20} />
                  </button>
                  <button className="action-btn" title="Video call">
                    <Video size={20} />
                  </button>
                  <button 
                    className="action-btn" 
                    title="More options"
                    onClick={toggleOptionsMenu}
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {/* Options menu dropdown */}
                  {showOptionsMenu && (
                    <div className="options-menu">
                      <button 
                        className="option-item delete"
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setShowOptionsMenu(false);
                        }}
                      >
                        <Trash2 size={16} />
                        Delete Conversation
                      </button>
                      {/* Add other options here as needed */}
                    </div>
                  )}
                  
                  {/* Delete confirmation dialog */}
                  {showDeleteConfirm && (
                    <div className="delete-conversation-confirmation">
                      <p>Delete this entire conversation?</p>
                      <div className="delete-actions">
                        <button 
                          className="delete-confirm"
                          onClick={handleDeleteConversation}
                        >
                          Delete
                        </button>
                        <button 
                          className="delete-cancel"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

            
          </div>

          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="no-messages">
                <div className="no-messages-icon">
                  <img src={LogoIcon} alt="Start conversation" className="no-chat-icon" />
                </div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.senderId === profile?.id?.toString() ? "message-sent" : "message-received"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="message-content">
                    {editingMessageId === msg.id ? (
                      <div className="message-edit-container">
                        <input
                          type="text"
                          className="message-edit-input"
                          value={editedMessageText}
                          onChange={(e) => setEditedMessageText(e.target.value)}
                          ref={editInputRef}
                          onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                        />
                        <div className="message-edit-actions">
                          <button 
                            className="message-edit-btn save" 
                            onClick={handleSaveEdit}
                            title="Save changes"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className="message-edit-btn cancel" 
                            onClick={handleCancelEdit}
                            title="Cancel editing"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {msg.text.startsWith('Sent an image:') ? (
                      <>
                        <div className="message-bubble">
                          <p>Image message</p>
                          {/* This is a placeholder. In a real implementation, you would display the actual image */}
                          <img 
                            src="/src/assets/images/image-placeholder.png" 
                            alt="Image message" 
                            className="message-image"
                          />
                        </div>
                      </>
                    ) : (


                      <div className="message-bubble">
                      {msg.text && <div className="message-text">{msg.text}</div>}
                      {msg.imageUrl && (
                        <div className="message-image-container">
                          <img 
                            src={msg.imageUrl}
                            alt="Shared image" 
                            className="message-image"
                            onClick={() => window.open(msg.imageUrl, '_blank')}
                          />
                        </div>
                      )}
                    </div>


                    )}
                        <div className="message-meta">
                          <span className="message-time">
                            {formatMessageTime(msg.timestamp)}
                            {msg.senderId === profile?.id?.toString() && (
                              <span className="message-status">
                                {msg.read ? " ✓✓" : " ✓"}
                              </span>
                            )}
                          </span>
                          
                          {/* Only show message actions for sent messages */}
                          {msg.senderId === profile?.id?.toString() && (
                            <div className="message-actions">
                              <button 
                                className="message-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMessageActions(msg.id);
                                }}
                                title="Message options"
                              >
                                <MoreVertical size={14} />
                              </button>
                              
                              {messageActionsId === msg.id && (
                                <div className="message-actions-menu">
                                  <button 
                                    className="message-action-item edit"
                                    onClick={() => handleStartEditing(msg)}
                                  >
                                    <Edit2 size={14} />
                                    Edit
                                  </button>
                                  <button 
                                    className="message-action-item delete"
                                    onClick={() => showDeleteConfirmation(msg.id)}
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              )}
                              
                              {confirmDeleteId === msg.id && (
                                <div className="delete-confirmation">
                                  <p>Delete this message?</p>
                                  <div className="delete-actions">
                                    <button 
                                      className="delete-confirm"
                                      onClick={() => handleDeleteMessage(msg.id)}
                                    >
                                      Delete
                                    </button>
                                    <button 
                                      className="delete-cancel"
                                      onClick={hideDeleteConfirmation}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                <div className="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
  <button 
    className="input-action" 
    title="Emoji"
    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
  >
    <Smile size={20} />
  </button>
  
  {showEmojiPicker && (
    <div className="emoji-picker-container">
      <EmojiPicker onEmojiClick={handleEmojiSelect} />
    </div>
  )}
  
  <button className="input-action" title="Attach file">
    <Paperclip size={20} />
  </button>





  {selectedImage && (
  <div className="selected-image-preview">
    <img 
      src={URL.createObjectURL(selectedImage)} 
      alt="Preview" 
      className="image-preview"
    />
    <span className="image-preview-caption">
      {selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
    </span>
    <button 
      className="remove-image-btn" 
      onClick={() => {
        setSelectedImage(null);
        setNewMessage("");
      }}
    >
      <X size={16} />
    </button>
  </div>
)}


  <input
  type="file"
  ref={fileInputRef}
  style={{ display: 'none' }}
  accept="image/*"
  onChange={handleFileChange}
/>

<button className="input-action" title="Send image" onClick={handleImageSelect}>
  <Image size={20} />
</button>



  <input
    type="text"
    placeholder="Type a message"
    className="message-input"
    value={newMessage}
    onChange={handleInputChange}
    onClick={handleInputClick}
    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
    disabled={isSending}
    ref={messageInputRef}
  />
 <button
  className={`send-btn ${(!newMessage.trim() && !selectedImage) ? 'disabled' : ''}`}
  onClick={handleSendMessage}
  disabled={isSending || (!newMessage.trim() && !selectedImage)}
  title="Send message"
>
  {isSending ? (
    <div className="send-loading"></div>
  ) : (
    <Send size={20} />
  )}
</button>



  <button className="input-action" title="Voice message">
    <Mic size={20} />
  </button>
</div>
        </div>
      ) : (
        <div className="no-chat">
          <div className="no-chat-content">
            <img src={LogoIcon} alt="Select a conversation" className="no-chat-icon" />
            <h2>Select a conversation to start messaging</h2>
            <p>Choose a conversation from the list or start a new one</p>
            <button className="new-chat-btn" onClick={() => setShowNewMessageModal(true)}>
              <UserPlus size={16} />
              New Conversation
            </button>
          </div>
        </div>
      )}
    </>
  );

  // User profile sidebar (right side)
  const RightSidebar = selectedUser && (
    <div className="user-profile-sidebar">
      <div className="user-profile">
        <img
          src={getAvatarUrl(selectedUser.avatar)}
          alt={selectedUser.name}
          className="profile-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/src/assets/images/profile/default-avatar.png';
          }}
        />
        <h2 className="profile-name">{selectedUser.name}</h2>
        <p className="profile-status">
          <span className={`status-indicator ${selectedUser.isOnline ? "online" : "offline"}`}></span>
          {selectedUser.isOnline ? "Online" : "Last seen recently"}
        </p>
      </div>
  
      <div className="user-details">
        <section className="details-section">
          <h3 className="section-title">About</h3>
          <div className="about-info">
            <p className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">@{selectedUser.username}</span>
            </p>
            {selectedUser.bio && (
              <p className="info-item bio">
                <span className="info-label">Bio:</span>
                <span className="info-value">{selectedUser.bio}</span>
              </p>
            )}
            <p className="info-item">
              <span className="info-label">Member since:</span>
              <span className="info-value">February 2024</span>
            </p>
          </div>
        </section>
  
        <section className="details-section">
          <h3 className="section-title">Shared Media</h3>
          <div className="media-grid">
            {/* Sample shared media - in a real app, this would be fetched from the backend */}
            <div className="media-item-placeholder">
              <div className="media-item-content">
                <span>No shared media yet</span>
              </div>
            </div>
          </div>
        </section>
  
        <section className="details-section">
          <h3 className="section-title">Actions</h3>
          <div className="profile-actions">
            <Link to={`/profiles/${selectedUser.username}`} className="profile-action-link">
              View Full Profile
            </Link>
            <button className="profile-action-button mute">
              Mute Notifications
            </button>
            <button className="profile-action-button block">
              Block User
            </button>
          </div>
        </section>
      </div>
    </div>
  );

  if (error) {
    return (
      <MessageLayout leftSidebar={LeftSidebar}>
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </MessageLayout>
    );
  }

  return (
    <MessageLayout 
      leftSidebar={LeftSidebar}
      rightSidebar={RightSidebar}
    >
      {ChatContent}
      
      {/* Add the NewMessageModal component */}
      {showNewMessageModal && (
        <NewMessageModal
          isOpen={showNewMessageModal}
          onClose={() => setShowNewMessageModal(false)}
          onSelectUser={handleStartConversation}
        />
      )}
    </MessageLayout>
  );
};

export default MessagesPage;