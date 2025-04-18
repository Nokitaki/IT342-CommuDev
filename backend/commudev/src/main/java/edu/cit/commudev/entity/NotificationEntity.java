package edu.cit.commudev.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "notifications")
public class NotificationEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;
    
    @Column(name = "notification_type")
    private String notificationType; // COMMENT, LIKE, FRIEND_REQUEST, etc.
    
    @Column(name = "notification_text", nullable = false)
    private String notificationText;
    
    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // The user who receives the notification
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // The user who triggered the notification (e.g., who made the comment)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "actor_id", nullable = false)
    private User actor;
    
    // Related post ID (if applicable)
    @Column(name = "related_post_id")
    private Integer relatedPostId;
    
    // Related comment ID (if applicable)
    @Column(name = "related_comment_id")
    private Long relatedCommentId;
    
    // Default constructor
    public NotificationEntity() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with essential fields
    public NotificationEntity(String notificationType, String notificationText, User user, User actor) {
        this.notificationType = notificationType;
        this.notificationText = notificationText;
        this.user = user;
        this.actor = actor;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }
    
    // Getters and Setters
    public Long getNotificationId() {
        return notificationId;
    }
    
    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }
    
    public String getNotificationType() {
        return notificationType;
    }
    
    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }
    
    public String getNotificationText() {
        return notificationText;
    }
    
    public void setNotificationText(String notificationText) {
        this.notificationText = notificationText;
    }
    
    public boolean isRead() {
        return isRead;
    }
    
    public void setRead(boolean read) {
        isRead = read;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public User getActor() {
        return actor;
    }
    
    public void setActor(User actor) {
        this.actor = actor;
    }
    
    public Integer getRelatedPostId() {
        return relatedPostId;
    }
    
    public void setRelatedPostId(Integer relatedPostId) {
        this.relatedPostId = relatedPostId;
    }
    
    public Long getRelatedCommentId() {
        return relatedCommentId;
    }
    
    public void setRelatedCommentId(Long relatedCommentId) {
        this.relatedCommentId = relatedCommentId;
    }
}