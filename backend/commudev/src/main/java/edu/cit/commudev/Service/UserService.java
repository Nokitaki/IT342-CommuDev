package edu.cit.commudev.Service;

import edu.cit.commudev.Entity.UserEntity;
import edu.cit.commudev.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;
    
    // Create a new user (Registration)
    public UserEntity createUser(UserEntity user) {
        // Check if username already exists
        if (userRepo.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        
        // Check if email already exists
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        // In a real application, you would hash the password here
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepo.save(user);
    }
    
    // Read all users
    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }
    
    // Read one user by ID
    public UserEntity getUserById(int id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User with ID: " + id + " not found"));
    }
    
    // Read user by username
    public UserEntity getUserByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User with username: " + username + " not found"));
    }
    
    // Search users by name
    public List<UserEntity> searchUsersByName(String searchTerm) {
        return userRepo.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
            searchTerm, searchTerm);
    }
    
    // Update user
    public UserEntity updateUser(int id, UserEntity userDetails) {
        UserEntity existingUser = getUserById(id);
        
        // Only update email if it's changed and not already taken by another user
        if (!existingUser.getEmail().equals(userDetails.getEmail())) {
            Optional<UserEntity> userWithEmail = userRepo.findByEmail(userDetails.getEmail());
            if (userWithEmail.isPresent() && userWithEmail.get().getUserId() != id) {
                throw new IllegalArgumentException("Email already registered to another account");
            }
            existingUser.setEmail(userDetails.getEmail());
        }
        
        // Update other fields
        existingUser.setFirstname(userDetails.getFirstname());
        existingUser.setMiddleinit(userDetails.getMiddleinit());
        existingUser.setLastname(userDetails.getLastname());
        existingUser.setDateOfBirth(userDetails.getDateOfBirth());
        existingUser.setAge(userDetails.getAge());
        existingUser.setState(userDetails.getState());
        existingUser.setEmploymentStatus(userDetails.getEmploymentStatus());
        existingUser.setProfilePicture(userDetails.getProfilePicture());
        existingUser.setBiography(userDetails.getBiography());
        
        // Don't update password here - should have a separate method for that with proper validation
        
        return userRepo.save(existingUser);
    }
    
    // Update password
    public UserEntity updatePassword(int id, String currentPassword, String newPassword) {
        UserEntity user = getUserById(id);
        
        // In a real application, you would check if the current password matches
        // if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
        //     throw new IllegalArgumentException("Current password is incorrect");
        // }
        
        // For demo purposes, we'll just check if they match directly
        if (!user.getPassword().equals(currentPassword)) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // In a real application, you would hash the new password
        // user.setPassword(passwordEncoder.encode(newPassword));
        user.setPassword(newPassword);
        
        return userRepo.save(user);
    }
    
    // Delete user
    public String deleteUser(int id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
            return "User with ID: " + id + " successfully deleted";
        } else {
            return "User with ID: " + id + " not found";
        }
    }
}