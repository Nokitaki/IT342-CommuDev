package edu.cit.commudev.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_likes")
public class PostLike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // This is the key fix - map to newsfeed_id instead of post_id
    @ManyToOne
    @JoinColumn(name = "newsfeed_id", nullable = false) 
    private NewsfeedEntity post;
    
    // If you actually do need both columns for some reason, add this:
    @Column(name = "post_id", insertable = false, updatable = false)
    private Integer postId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public PostLike() {
    }
    
    public PostLike(User user, NewsfeedEntity post) {
        this.user = user;
        this.post = post;
    }
    
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    @PrePersist
public void prePersist() {
    // Make sure newsfeed_id gets populated from post
    if (post != null && post.getNewsfeedId() != 0) {
        this.postId = post.getNewsfeedId();
    }
}
}