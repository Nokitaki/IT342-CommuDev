package edu.cit.commudev.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "friendships")
public class Friendship {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "friendship_id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_one_id", nullable = false)
    @JsonManagedReference
    private User userOne;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_two_id", nullable = false)
    @JsonManagedReference
    private User userTwo;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public Friendship() {
    }
    
    public Friendship(User userOne, User userTwo) {
        this.userOne = userOne;
        this.userTwo = userTwo;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUserOne() {
        return userOne;
    }
    
    public void setUserOne(User userOne) {
        this.userOne = userOne;
    }
    
    public User getUserTwo() {
        return userTwo;
    }
    
    public void setUserTwo(User userTwo) {
        this.userTwo = userTwo;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}