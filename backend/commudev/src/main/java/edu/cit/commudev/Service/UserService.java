package edu.cit.commudev.Service;

import edu.cit.commudev.Entity.UserEntity;
import edu.cit.commudev.Repository.UserRepo;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
private PasswordEncoder passwordEncoder;
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
     @Transactional
public UserEntity updatePassword(int id, String currentPassword, String newPassword) {
    UserEntity user = getUserById(id);

    // Log the password update attempt
    System.out.println("Updating password for user ID: " + id);

    // Validate current and new passwords
    if (currentPassword == null || currentPassword.trim().isEmpty()) {
        throw new IllegalArgumentException("Current password cannot be empty");
    }

    if (newPassword == null || newPassword.trim().isEmpty()) {
        throw new IllegalArgumentException("New password cannot be empty");
    }

    if (newPassword.length() < 8) {
        throw new IllegalArgumentException("New password must be at least 8 characters long");
    }

    if (passwordEncoder.matches(newPassword, user.getPassword())) {
        throw new IllegalArgumentException("New password cannot be the same as the current password");
    }

    // Verify the current password
    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
        throw new IllegalArgumentException("Current password is incorrect");
    }

    // Encode and update the new password
    user.setPassword(passwordEncoder.encode(newPassword));

    return userRepo.save(user);
}

// Add this method to the UserService class
public String deleteUser(int id) {
    // Implement the logic to delete a user by ID
    // For example:
    Optional<UserEntity> user = userRepo.findById(id);
    if (user.isPresent()) {
        userRepo.delete(user.get());
        return "User deleted successfully";
    } else {
        throw new IllegalArgumentException("User not found with ID: " + id);
    }
}

}