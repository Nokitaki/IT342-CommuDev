// src/pages/messages/MessagesPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip, Image, Mic, Phone, Video } from "lucide-react";
import { Link } from "react-router-dom";
import MessageLayout from "../../layouts/MessagesLayout";
import "../../styles/pages/messages.css";

// Import your logo and profile images
import LogoIcon from "../../assets/images/logo.png";
import Prof1 from "../../assets/images/profile/prof1.png";

const MessagesPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock data for users - EXPANDED with more users
  useEffect(() => {
    // This would be replaced with your actual API call
    const mockUsers = [
      {
        id: 1,
        name: "Maria Garcia",
        avatar: Prof1,
        online: true,
        lastMessage: "Hey, how are you doing?",
        age: 28,
        state: "California",
        employmentStatus: "Full-time",
        dateJoined: "January 2024"
      },
      {
        id: 2,
        name: "Robert Chen",
        avatar: Prof1,
        online: true,
        lastMessage: "Did you see the new community guidelines?",
        age: 32,
        state: "New York",
        employmentStatus: "Self-employed",
        dateJoined: "December 2023"
      },
      {
        id: 3,
        name: "Sarah Johnson",
        avatar: Prof1,
        online: false,
        lastMessage: "Thanks for your help yesterday!",
        age: 25,
        state: "Texas",
        employmentStatus: "Part-time",
        dateJoined: "February 2024"
      },
      {
        id: 4,
        name: "David Wilson",
        avatar: Prof1,
        online: true,
        lastMessage: "Looking forward to the community event",
        age: 34,
        state: "Florida",
        employmentStatus: "Full-time",
        dateJoined: "November 2023"
      },
      {
        id: 5,
        name: "Jennifer Lopez",
        avatar: Prof1,
        online: false,
        lastMessage: "Let me know when you're free to discuss the project",
        age: 30,
        state: "Illinois",
        employmentStatus: "Full-time",
        dateJoined: "January 2024"
      },
      // New additional users
      {
        id: 6,
        name: "Michael Brown",
        avatar: Prof1,
        online: true,
        lastMessage: "Can you share the resource documents you mentioned?",
        age: 42,
        state: "Washington",
        employmentStatus: "Full-time",
        dateJoined: "October 2023"
      },
      {
        id: 7,
        name: "Emma Thompson",
        avatar: Prof1,
        online: true,
        lastMessage: "I've finished the design for the community newsletter",
        age: 27,
        state: "Oregon",
        employmentStatus: "Freelancer",
        dateJoined: "December 2023"
      },
      {
        id: 8,
        name: "James Rodriguez",
        avatar: Prof1,
        online: false,
        lastMessage: "Will you be attending the volunteer orientation?",
        age: 31,
        state: "Arizona",
        employmentStatus: "Part-time",
        dateJoined: "November 2023"
      },
      {
        id: 9,
        name: "Sophia Kim",
        avatar: Prof1,
        online: true,
        lastMessage: "The community garden project is coming along nicely!",
        age: 29,
        state: "Michigan",
        employmentStatus: "Full-time",
        dateJoined: "January 2024"
      },
      {
        id: 10,
        name: "Lucas Patel",
        avatar: Prof1,
        online: false,
        lastMessage: "Can we reschedule our meeting for next week?",
        age: 35,
        state: "Colorado",
        employmentStatus: "Full-time",
        dateJoined: "September 2023"
      },
      {
        id: 11,
        name: "Isabella Martinez",
        avatar: Prof1,
        online: true,
        lastMessage: "I've uploaded the new resources to the shared folder",
        age: 26,
        state: "New Jersey",
        employmentStatus: "Student",
        dateJoined: "February 2024"
      },
      {
        id: 12,
        name: "Aiden Wong",
        avatar: Prof1,
        online: false,
        lastMessage: "Just finished the sustainability workshop. It was great!",
        age: 33,
        state: "Pennsylvania",
        employmentStatus: "Full-time",
        dateJoined: "December 2023"
      },
      {
        id: 13,
        name: "Olivia Jackson",
        avatar: Prof1,
        online: true,
        lastMessage: "Do you have the contact information for the local officials?",
        age: 39,
        state: "Minnesota",
        employmentStatus: "Part-time",
        dateJoined: "November 2023"
      },
      {
        id: 14,
        name: "Ethan Singh",
        avatar: Prof1,
        online: true,
        lastMessage: "Thanks for helping with the fundraiser last week",
        age: 30,
        state: "Virginia",
        employmentStatus: "Full-time",
        dateJoined: "October 2023"
      },
      {
        id: 15,
        name: "Ava Williams",
        avatar: Prof1,
        online: false,
        lastMessage: "When is the next town hall meeting?",
        age: 28,
        state: "Georgia",
        employmentStatus: "Entrepreneur",
        dateJoined: "January 2024"
      }
    ];

    setUsers(mockUsers);
    setSelectedUser(mockUsers[0]);
    setIsLoading(false);
  }, []);

  // Mock messages data
  useEffect(() => {
    if (!selectedUser) return;

    // This would be replaced with your actual API call
    const mockMessages = [
      {
        id: 1,
        text: "Hey there! How are you doing today?",
        sender: "other",
        timestamp: "9:30 AM",
        isRead: true
      },
      {
        id: 2,
        text: "I'm doing well, thanks for asking! Just working on some community projects.",
        sender: "me",
        timestamp: "9:32 AM",
        isRead: true
      },
      {
        id: 3,
        text: "That sounds great! Which projects are you involved with?",
        sender: "other",
        timestamp: "9:35 AM",
        isRead: true
      },
      {
        id: 4,
        text: "I'm helping organize the community garden initiative and also working on the resource sharing platform.",
        sender: "me",
        timestamp: "9:40 AM",
        isRead: true
      },
      {
        id: 5,
        text: "That's amazing! I'd love to help with the garden initiative. When is the next meeting?",
        sender: "other",
        timestamp: "9:42 AM",
        isRead: true
      },
      {
        id: 6,
        text: "We're meeting this Saturday at 10 AM at the community center. Would you like to join us?",
        sender: "me",
        timestamp: "9:45 AM",
        isRead: true
      },
      {
        id: 7,
        text: "Definitely! I'll be there. Should I bring anything?",
        sender: "other",
        timestamp: "9:47 AM",
        isRead: true
      },
      {
        id: 8,
        text: "Just bring your ideas and enthusiasm! We'll provide all the materials needed for the planning session.",
        sender: "me",
        timestamp: "9:50 AM",
        isRead: true
      }
    ];

    setMessages(mockMessages);
  }, [selectedUser]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedUser || isSending) return;
    
    setIsSending(true);
    
    // Create a new message
    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isRead: false
    };
    
    // Add the new message to the conversation
    setMessages([...messages, newMsg]);
    
    // Update the last message in the users list
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === selectedUser.id
          ? { ...user, lastMessage: newMessage }
          : user
      )
    );
    
    // Clear the input
    setNewMessage("");
    setIsSending(false);
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
          />
        </div>
      </div>
  
      <div className="conversations-list">
        {users.map((user) => (
          <div
            key={user.id}
            className={`conversation-item ${selectedUser?.id === user.id ? "active" : ""}`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="user-avatar">
              <img 
                src={user.avatar}
                alt={user.name}
                className="avatar-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Prof1;
                }}
              />
              {user.online && <span className="online-indicator"></span>}
            </div>
            <div className="conversation-info">
              <h3 className="m-user-name">{user.name}</h3>
              <p className="last-message">{user.lastMessage || "No messages yet"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Right sidebar content - User Profile
  const RightSidebar = selectedUser && (
    <div className="user-profile-sidebar">
      <div className="user-profile">
        <img
          src={selectedUser.avatar}
          alt={selectedUser.name}
          className="profile-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = Prof1;
          }}
        />
        <h2 className="profile-name">{selectedUser.name}</h2>
        <p className="profile-status">
          {selectedUser.online ? "Active Now" : "Offline"}
        </p>
      </div>
  
      <div className="user-details">
        <section className="details-section">
          <h3 className="section-title">About</h3>
          <div className="about-info">
            <p className="info-item">
              <span className="info-label">Age:</span>
              <span className="info-value">{selectedUser.age || 'Not specified'}</span>
            </p>
            <p className="info-item">
              <span className="info-label">State:</span>
              <span className="info-value">{selectedUser.state || 'Not specified'}</span>
            </p>
            <p className="info-item">
              <span className="info-label">Employment:</span>
              <span className="info-value">{selectedUser.employmentStatus || 'Not specified'}</span>
            </p>
            <p className="info-item">
              <span className="info-label">Joined:</span>
              <span className="info-value">{selectedUser.dateJoined || 'January 2024'}</span>
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
          <h3 className="section-title">Settings</h3>
          <div className="setting-option">
            <span>Mute Notifications</span>
            <div className="toggle-switch"></div>
          </div>
        </section>
      </div>
    </div>
  );

  // Main chat content
  const ChatContent = (
    <>
      {selectedUser ? (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-user-info">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="chat-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Prof1;
                }}
              />
              <div className="chat-user-details">
                <h2 className="chat-user-name">{selectedUser.name}</h2>
                <p className="chat-user-status">
                  {selectedUser.online ? "Online" : "Offline"}
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === "me" ? "message-sent" : "message-received"}`}
              >
                <div className="message-content">
                  <div className="message-bubble">{msg.text}</div>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
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
              onChange={(e) => setNewMessage(e.target.value)}
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
          <p>Select a conversation to start messaging</p>
        </div>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <MessageLayout 
      leftSidebar={LeftSidebar}
      rightSidebar={RightSidebar}
    >
      {ChatContent}
    </MessageLayout>
  );
};

export default MessagesPage;