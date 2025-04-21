// src/pages/messages/MessagesPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip, Image, Mic, Phone, Video, Search, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import MessageLayout from "../../layouts/MessagesLayout";
import useMessages from "../../hooks/useMessages";
import useProfile from "../../hooks/useProfile";
import Avatar from "../../components/common/Avatar";
import NewMessageModal from '../../components/modals/NewMessageModal';
import { formatTimeAgo } from "../../utils/dateUtils";
import "../../styles/pages/messages.css";
import { auth } from "../../services/firebaseAuth";
import { debugFirestore } from "../../services/firebaseService";

// Import your logo
import LogoIcon from "../../assets/images/logo.png";

const MessagesPage = () => {
  useEffect(() => {
    // Debug auth state and user ID
    console.log("MessagesPage - Current auth state:", auth.currentUser);
    console.log("MessagesPage - localStorage userId:", localStorage.getItem('userId'));
    
    // Debug Firestore data
    const checkFirestore = async () => {
      try {
        const allConversations = await debugFirestore();
        console.log("MessagesPage - All Firestore conversations:", allConversations);
      } catch (error) {
        console.error("Error checking Firestore:", error);
      }
    };
    
    checkFirestore();
  }, []);
  
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
    setLastRefresh  // Add this
  } = useMessages();  // Start a new conversation with a user

  
  const { profile } = useProfile();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const messagesEndRef = useRef(null);
  
  // API URL for images
  const API_URL = 'http://localhost:8080';

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const otherUserName = conv.otherUserName ? conv.otherUserName.toLowerCase() : '';
    
    return otherUserName.includes(searchLower);
  });

  // Handle send message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !currentConversation || isSending) return;
    
    setIsSending(true);
    
    try {
      const success = await sendNewMessage(newMessage);
      if (success) {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };
  
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
      
      console.log('Starting conversation with user:', user);
      console.log('Current user:', profile);
      
      try {
        // Convert user.id to string to ensure compatibility
        const conversationId = await startConversation(user.id.toString());
        
        if (conversationId) {
          console.log('Conversation started successfully with ID:', conversationId);
          setShowNewMessageModal(false);
          
          // Force refresh conversation list
          setTimeout(() => {
            setLastRefresh(Date.now());
          }, 500);
        } else {
          console.error('Failed to start conversation, no ID returned');
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
                {/* Placeholder for online indicator */}
                {false && <span className="online-indicator"></span>}
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
                  {/* Placeholder for online status */}
                  {false ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="chat-actions">
              <button className="action-btn">
                <Phone size={20} />
              </button>
              <button className="action-btn">
                <Video size={20} />
              </button>
            </div>
          </div>

          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.senderId === profile?.id?.toString() ? "message-sent" : "message-received"}`}
                >
                  <div className="message-content">
                    <div className="message-bubble">{msg.text}</div>
                    <span className="message-time">
                      {formatMessageTime(msg.timestamp)}
                      {msg.senderId === profile?.id?.toString() && (
                        <span className="message-status">
                          {msg.read ? " ✓✓" : " ✓"}
                        </span>
                      )}
                    </span>
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
            <button className="input-action">
              <Smile size={20} />
            </button>
            <button className="input-action">
              <Paperclip size={20} />
            </button>
            <button className="input-action">
              <Image size={20} />
            </button>
            <input
              type="text"
              placeholder="Type a message"
              className="message-input"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isSending}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={isSending}
            >
              <Send size={20} />
            </button>
            <button className="input-action">
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
          {/* Placeholder for online status */}
          {false ? "Online" : "Last seen recently"}
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
            {/* Placeholder info - in a real app you'd get this from your user API */}
            <p className="info-item">
              <span className="info-label">Member since:</span>
              <span className="info-value">January 2024</span>
            </p>
          </div>
        </section>
  
        <section className="details-section">
          <h3 className="section-title">Shared Media</h3>
          <div className="media-grid">
            <p>No shared media yet</p>
          </div>
        </section>
  
        <section className="details-section">
          <h3 className="section-title">Actions</h3>
          <div className="profile-actions">
            <Link to={`/profiles/${selectedUser.username}`} className="profile-action-link">
              View Full Profile
            </Link>
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