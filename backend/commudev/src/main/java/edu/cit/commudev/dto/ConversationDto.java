package edu.cit.commudev.dto;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
public class ConversationDto {
    private Long id;
    private String lastMessage;
    private Long lastSenderId;
    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;
    
    // Other user information
    private Long otherUserId;
    private String otherUserName;
    private String otherUserAvatar;
    private String otherUsername;
    
    // Unread count
    private int unreadCount;
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public String getLastMessage() {
        return lastMessage;
    }
    
    public Long getLastSenderId() {
        return lastSenderId;
    }
    
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public Long getOtherUserId() {
        return otherUserId;
    }
    
    public String getOtherUserName() {
        return otherUserName;
    }
    
    public String getOtherUserAvatar() {
        return otherUserAvatar;
    }
    
    public String getOtherUsername() {
        return otherUsername;
    }
    
    public int getUnreadCount() {
        return unreadCount;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }
    
    public void setLastSenderId(Long lastSenderId) {
        this.lastSenderId = lastSenderId;
    }
    
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }
    
    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }
    
    public void setOtherUserAvatar(String otherUserAvatar) {
        this.otherUserAvatar = otherUserAvatar;
    }
    
    public void setOtherUsername(String otherUsername) {
        this.otherUsername = otherUsername;
    }
    
    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }
}