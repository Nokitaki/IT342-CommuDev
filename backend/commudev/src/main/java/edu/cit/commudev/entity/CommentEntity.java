package edu.cit.commudev.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "comments")
public class CommentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;
    
    @Column(name = "comment_text", nullable = false)
    private String commentText;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "newsfeed_id", nullable = false)
    private NewsfeedEntity post;
    
    // Default constructor
    public CommentEntity() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Parameterized constructor
    public CommentEntity(String commentText, User user, NewsfeedEntity post) {
        this.commentText = commentText;
        this.user = user;
        this.post = post;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getCommentId() {
        return commentId;
    }
    
    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }
    
    public String getCommentText() {
        return commentText;
    }
    
    public void setCommentText(String commentText) {
        this.commentText = commentText;
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
    
    public NewsfeedEntity getPost() {
        return post;
    }
    
    public void setPost(NewsfeedEntity post) {
        this.post = post;
    }
}