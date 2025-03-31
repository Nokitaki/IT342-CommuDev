package edu.cit.commudev.Service;

import edu.cit.commudev.Entity.UserAuthEntity;
import edu.cit.commudev.Entity.UserEntity;
import edu.cit.commudev.Repository.UserAuthRepo;
import edu.cit.commudev.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class UserAuthService {

    @Autowired
    private UserAuthRepo userAuthRepo;
    
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Register a new user auth entry (typically called after creating a user)
    public UserAuthEntity registerUserAuth(String username) {
        // Check if username already exists in auth table
        if (userAuthRepo.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already registered in auth system");
        }
        
        // Create and save new auth entry
        UserAuthEntity userAuth = new UserAuthEntity(username);
        return userAuthRepo.save(userAuth);
    }
    
    // Login validation
    public boolean validateCredentials(String username, String password) {
        // Check if username exists in users table
        UserEntity user = userRepo.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        // Use password encoder to verify the password
        return passwordEncoder.matches(password, user.getPassword());
    }
    
    // Get auth info by username
    public UserAuthEntity getAuthByUsername(String username) {
        return userAuthRepo.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Auth entry not found for username: " + username));
    }
    
    // Delete auth entry (typically when deleting a user)
    public void deleteAuthByUsername(String username) {
        UserAuthEntity userAuth = getAuthByUsername(username);
        userAuthRepo.delete(userAuth);
    }
}