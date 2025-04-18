package edu.cit.commudev.controller;

import edu.cit.commudev.dto.PublicUserProfileDto;
import edu.cit.commudev.dto.UserDto;
import edu.cit.commudev.dto.UserProfileUpdateDto;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * Get the current authenticated user's profile
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(convertToDto(user));
    }
    
    /**
     * Update the current authenticated user's profile
     */
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UserProfileUpdateDto profileUpdate) {
        
        User updatedUser = userService.updateCurrentUserProfile(profileUpdate);
        return ResponseEntity.ok(convertToDto(updatedUser));
    }
    
    /**
     * Upload profile picture for the current user
     */
    @PostMapping("/me/picture")
    public ResponseEntity<UserDto> uploadProfilePicture(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        User updatedUser = userService.updateProfilePicture(file);
        return ResponseEntity.ok(convertToDto(updatedUser));
    }
    
    /**
     * Upload cover photo for the current user
     */
    @PostMapping("/me/cover")
    public ResponseEntity<UserDto> uploadCoverPhoto(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        User updatedUser = userService.updateCoverPhoto(file);
        return ResponseEntity.ok(convertToDto(updatedUser));
    }
    
    /**
     * Get a user's public profile by username
     */
    @GetMapping("/profiles/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        try {
            User profileUser = userService.getUserByUsername(username);
            
            // Check if profile is public
            if (profileUser.getProfileVisibility().toString().equals("PUBLIC")) {
                PublicUserProfileDto publicProfile = new PublicUserProfileDto();
                publicProfile.setUsername(profileUser.getUsername());
                publicProfile.setFirstname(profileUser.getFirstname());
                publicProfile.setLastname(profileUser.getLastname());
                publicProfile.setProfilePicture(profileUser.getProfilePicture());
                publicProfile.setBiography(profileUser.getBiography());
                publicProfile.setCountry(profileUser.getCountry() != null ? 
                    profileUser.getCountry().toString() : null);
                publicProfile.setProfileVisibility(profileUser.getProfileVisibility().toString());
                publicProfile.setCoverPhoto(profileUser.getCoverPhoto());
                
                return ResponseEntity.ok(publicProfile);
            } else {
                // For non-public profiles, return limited info
                PublicUserProfileDto limitedProfile = new PublicUserProfileDto();
                limitedProfile.setUsername(profileUser.getUsername());
                limitedProfile.setProfileVisibility(profileUser.getProfileVisibility().toString());
                
                return ResponseEntity.ok(limitedProfile);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found or profile not accessible");
        }
    }
    
    /**
     * Get all users (for admin/manager)
     */
    @GetMapping("/")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.allUsers();
        List<UserDto> userDtos = users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }
    
    /**
     * Get all users (public endpoint for "People You May Know" feature)
     */
    @GetMapping("/all")
    public ResponseEntity<List<UserDto>> getAllPublicUsers() {
        List<User> users = userService.allUsers();
        List<UserDto> userDtos = users.stream()
                .map(user -> {
                    UserDto dto = new UserDto();
                    dto.setId(user.getId());
                    dto.setUsername(user.getUsername());
                    dto.setProfilePicture(user.getProfilePicture());
                    dto.setFirstname(user.getFirstname());
                    dto.setLastname(user.getLastname());
                    dto.setProfileVisibility(user.getProfileVisibility().toString());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    /**
     * Helper method to convert User entity to UserDto
     */
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstname(user.getFirstname());
        dto.setLastname(user.getLastname());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setAge(user.getAge());
        dto.setCountry(user.getCountry() != null ? user.getCountry().toString() : null);
        dto.setEmploymentStatus(user.getEmploymentStatus() != null ? 
                user.getEmploymentStatus().toString() : null);
        dto.setProfilePicture(user.getProfilePicture());
        dto.setBiography(user.getBiography());
        dto.setEnabled(user.isEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setProfileVisibility(user.getProfileVisibility().toString());
        dto.setCoverPhoto(user.getCoverPhoto());
        
        // Convert roles to string list
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());
        dto.setRoles(roles);
        
        return dto;
    }
}