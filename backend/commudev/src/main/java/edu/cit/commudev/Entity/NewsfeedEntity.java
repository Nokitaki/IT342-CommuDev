package edu.cit.commudev.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "newsfeed")
public class NewsfeedEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int newsfeed_id;
    
    private String post_description;
    private String post_type;
    private LocalDateTime post_date;
    private int like_count;
    private String post_status;
    
    // Default constructor
    public NewsfeedEntity() {
        this.post_date = LocalDateTime.now();
        this.like_count = 0;
        this.post_status = "active";
    }
    
    // Parameterized constructor
    public NewsfeedEntity(String post_description, String post_type) {
        this.post_description = post_description;
        this.post_type = post_type;
        this.post_date = LocalDateTime.now();
        this.like_count = 0;
        this.post_status = "active";
    }
    
    // Getters and Setters
    public int getNewsfeed_id() {
        return newsfeed_id;
    }
    
    public void setNewsfeed_id(int newsfeed_id) {
        this.newsfeed_id = newsfeed_id;
    }
    
    public String getPost_description() {
        return post_description;
    }
    
    public void setPost_description(String post_description) {
        this.post_description = post_description;
    }
    
    public String getPost_type() {
        return post_type;
    }
    
    public void setPost_type(String post_type) {
        this.post_type = post_type;
    }
    
    public LocalDateTime getPost_date() {
        return post_date;
    }
    
    public void setPost_date(LocalDateTime post_date) {
        this.post_date = post_date;
    }
    
    public int getLike_count() {
        return like_count;
    }
    
    public void setLike_count(int like_count) {
        this.like_count = like_count;
    }
    
    public String getPost_status() {
        return post_status;
    }
    
    public void setPost_status(String post_status) {
        this.post_status = post_status;
    }
}