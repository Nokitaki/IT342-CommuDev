package edu.cit.commudev.controller;

import edu.cit.commudev.dto.PublicUserProfileDto;
import edu.cit.commudev.dto.UserDto;
import edu.cit.commudev.dto.UserProfileUpdateDto;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get current authenticated user's profile
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(convertToDetailedDto(currentUser));
        
    }

    // Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUserProfile(@RequestBody UserProfileUpdateDto updateDto) {
        try {
            User updatedUser = userService.updateCurrentUserProfile(updateDto);
            return ResponseEntity.ok(convertToDetailedDto(updatedUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Upload profile picture
    @PostMapping("/me/picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }
            
            User updatedUser = userService.updateProfilePicture(file);
            return ResponseEntity.ok(convertToDetailedDto(updatedUser));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    // Get user profile by username - public endpoint
    @GetMapping("/profiles/{username}")
    public ResponseEntity<?> getPublicUserProfile(
            @PathVariable String username, 
            Authentication authentication) {
        
        try {
            User profileUser = userService.getUserByUsername(username);
            
            // Get current user if authenticated
            User currentUser = null;
            if (authentication != null && authentication.isAuthenticated()) {
                currentUser = userService.getCurrentUser();
            }
            
            // Check if the current user can view this profile
            if (!userService.canViewProfile(currentUser, profileUser)) {
                // Return limited profile for users without access
                PublicUserProfileDto limitedProfile = new PublicUserProfileDto();
                limitedProfile.setUsername(profileUser.getUsername());
                limitedProfile.setProfileVisibility("PRIVATE");
                return ResponseEntity.ok(limitedProfile);
            }
            
            // User has access, return the public profile
            return ResponseEntity.ok(convertToPublicDto(profileUser));
            
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found: " + username);
        }
    }

    // Helper method to convert User to detailed UserDto
    private UserDto convertToDetailedDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstname(user.getFirstname());
        dto.setLastname(user.getLastname());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setAge(user.getAge());
        dto.setCountry(user.getCountry() != null ? user.getCountry().name() : null);
        dto.setEmploymentStatus(user.getEmploymentStatus() != null ? 
                user.getEmploymentStatus().name() : null);
        dto.setProfilePicture(user.getProfilePicture());
        
        // Add this line to include cover photo
        dto.setCoverPhoto(user.getCoverPhoto());
        
        dto.setBiography(user.getBiography());
        dto.setEnabled(user.isEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setProfileVisibility(user.getProfileVisibility() != null ? 
                user.getProfileVisibility().name() : "PUBLIC");
        
        // Convert roles to string list
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList()));
        
        return dto;
    }

    // Helper method to convert User to PublicUserProfileDto
    private PublicUserProfileDto convertToPublicDto(User user) {
        PublicUserProfileDto dto = new PublicUserProfileDto();
        dto.setUsername(user.getUsername());
        dto.setFirstname(user.getFirstname());
        dto.setLastname(user.getLastname());
        dto.setProfilePicture(user.getProfilePicture());
        
        // Add this line to include cover photo
        dto.setCoverPhoto(user.getCoverPhoto());
        
        dto.setBiography(user.getBiography());
        dto.setCountry(user.getCountry() != null ? user.getCountry().getDisplayName() : null);
        dto.setProfileVisibility(user.getProfileVisibility() != null ? 
                user.getProfileVisibility().name() : "PUBLIC");
        return dto;
    }


    @PostMapping("/me/cover")
public ResponseEntity<?> uploadCoverPhoto(@RequestParam("file") MultipartFile file) {
    try {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }
        
        User updatedUser = userService.updateCoverPhoto(file);
        return ResponseEntity.ok(convertToDetailedDto(updatedUser));
    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to upload file: " + e.getMessage());
    }
}
}