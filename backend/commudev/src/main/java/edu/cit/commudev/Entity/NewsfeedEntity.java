package edu.cit.commudev.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "newsfeed")
public class NewsfeedEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "newsfeed_id")
    private int newsfeedId;
    
    @Column(name = "post_description")
    private String postDescription;
    
    @Column(name = "post_type")
    private String postType;
    
    @Column(name = "post_date")
    private LocalDateTime postDate;
    
    @Column(name = "like_count")
    private int likeCount;
    
    @Column(name = "post_status")
    private String postStatus;
    

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Default constructor
    public NewsfeedEntity() {
        this.postDate = LocalDateTime.now();
        this.likeCount = 0;
        this.postStatus = "active";
    }
    
    // Parameterized constructor
    public NewsfeedEntity(String postDescription, String postType) {
        this.postDescription = postDescription;
        this.postType = postType;
        this.postDate = LocalDateTime.now();
        this.likeCount = 0;
        this.postStatus = "active";
    }
    
    // Getters and Setters
    public int getNewsfeedId() {
        return newsfeedId;
    }
    
    public void setNewsfeedId(int newsfeedId) {
        this.newsfeedId = newsfeedId;
    }
    
    public String getPostDescription() {
        return postDescription;
    }
    
    public void setPostDescription(String postDescription) {
        this.postDescription = postDescription;
    }
    
    public String getPostType() {
        return postType;
    }
    
    public void setPostType(String postType) {
        this.postType = postType;
    }
    
    public LocalDateTime getPostDate() {
        return postDate;
    }
    
    public void setPostDate(LocalDateTime postDate) {
        this.postDate = postDate;
    }
    
    public int getLikeCount() {
        return likeCount;
    }
    
    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }
    
    public String getPostStatus() {
        return postStatus;
    }
    
    public void setPostStatus(String postStatus) {
        this.postStatus = postStatus;
    }
    
    // New getter and setter for user
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
}