package edu.cit.commudev.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_auth")
public class UserAuthEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(name = "username", unique = true, nullable = false)
    private String username;
    
    // You might want to add more fields for authentication purposes like:
    // - last login timestamp
    // - account status (active, locked, etc.)
    // - token for password reset
    // - 2FA information
    
    // Default constructor
    public UserAuthEntity() {
    }
    
    // Constructor with username
    public UserAuthEntity(String username) {
        this.username = username;
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
}