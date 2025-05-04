package edu.cit.commudev.service;

import edu.cit.commudev.dto.UserProfileUpdateDto;
import edu.cit.commudev.entity.Country;
import edu.cit.commudev.entity.EmploymentStatus;
import edu.cit.commudev.entity.ProfileVisibility;
import edu.cit.commudev.entity.Role;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.util.stream.StreamSupport;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import edu.cit.commudev.repository.RoleRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
/**
 * Service for user management.
 * Implements UserDetailsService for Spring Security integration.
 */
@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Load user by username for Spring Security authentication.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find user by email first
        Optional<User> userByEmail = userRepository.findByEmail(username);
        if (userByEmail.isPresent()) {
            return userByEmail.get();
        }

        // If not found by email, try by username
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    /**
     * Get all users.
     *
     * @return List of all users
     */
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    /**
     * Find user by ID.
     *
     * @param id user ID
     * @return Optional of User
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Find user by username.
     *
     * @param username the username
     * @return Optional of User
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Find user by email.
     *
     * @param email the email
     * @return Optional of User
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Get currently authenticated user.
     *
     * @return the authenticated user
     */
   /**
 * Helper method to get the current authenticated user
 * @return Current user or null if not authenticated
 */
private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        return null;
    }
    
    Object principal = authentication.getPrincipal();
    if (principal instanceof User) {
        return (User) principal;
    } else if (principal instanceof String) {
        String username = (String) principal;
        return userRepository.findByUsername(username).orElse(null);
    }
    
    return null;
}

    /**
     * Enable or disable a user.
     *
     * @param userId user ID
     * @param enabled enabled status
     * @return updated User
     */
    @Transactional
    public User setUserEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    /**
     * Add a role to a user.
     *
     * @param userId user ID
     * @param roleName role name
     * @return updated User
     */
    @Transactional
    public User addRoleToUser(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new EntityNotFoundException("Role not found: " + roleName));

        user.addRole(role);
        return userRepository.save(user);
    }

    /**
     * Count total number of users.
     *
     * @return user count
     */
    public long countUsers() {
        return userRepository.count();
    }

    /**
     * Count active (enabled) users.
     *
     * @return active user count
     */
    public long countActiveUsers() {
        return StreamSupport.stream(userRepository.findAll().spliterator(), false)
                .filter(User::isEnabled)
                .count();
    }

    /**
     * Get verification rate (percentage of verified users).
     *
     * @return verification rate as percentage
     */
    public double getVerificationRate() {
        long totalUsers = countUsers();
        if (totalUsers == 0) {
            return 0.0;
        }

        long verifiedUsers = countActiveUsers();
        return (double) verifiedUsers / totalUsers * 100.0;
    }

    /**
     * Update the current user's profile information
     * @param updateDto DTO containing fields to update
     * @return updated User entity
     */
    @Transactional
    public User updateCurrentUserProfile(UserProfileUpdateDto updateDto) {
        User currentUser = getCurrentUser();
        
        // Update fields if provided
        if (updateDto.getFirstname() != null) {
            currentUser.setFirstname(updateDto.getFirstname());
        }
        if (updateDto.getLastname() != null) {
            currentUser.setLastname(updateDto.getLastname());
        }
        if (updateDto.getDateOfBirth() != null) {
            currentUser.setDateOfBirth(updateDto.getDateOfBirth());
        }
        if (updateDto.getAge() != null) {
            currentUser.setAge(updateDto.getAge());
        }
        if (updateDto.getCountry() != null) {
            try {
                currentUser.setCountry(Country.valueOf(updateDto.getCountry()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid country: " + updateDto.getCountry());
            }
        }
        if (updateDto.getEmploymentStatus() != null) {
            try {
                currentUser.setEmploymentStatus(EmploymentStatus.valueOf(updateDto.getEmploymentStatus()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid employment status: " + updateDto.getEmploymentStatus());
            }
        }
        if (updateDto.getBiography() != null) {
            currentUser.setBiography(updateDto.getBiography());
        }
        if (updateDto.getProfileVisibility() != null) {
            try {
                currentUser.setProfileVisibility(ProfileVisibility.valueOf(updateDto.getProfileVisibility()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid profile visibility setting: " + updateDto.getProfileVisibility());
            }
        }
        
        return userRepository.save(currentUser);
    }

    /**
     * Get a user by username
     * @param username the username to search
     * @return User entity if found
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    /**
     * Check if a user has permission to view another user's profile
     * @param viewerUser the user trying to view the profile (can be null for anonymous)
     * @param profileUser the profile owner
     * @return true if access is allowed
     */
    public boolean canViewProfile(User viewerUser, User profileUser) {
        // Public profiles are visible to everyone
        if (profileUser.getProfileVisibility() == ProfileVisibility.PUBLIC) {
            return true;
        }
        
        // Private profiles are only visible to the owner
        if (profileUser.getProfileVisibility() == ProfileVisibility.PRIVATE) {
            return viewerUser != null && viewerUser.getId().equals(profileUser.getId());
        }
        
        // FRIENDS visibility - would need friendship relationship logic
        // For now, only the user can see their own profile with FRIENDS visibility
        return viewerUser != null && viewerUser.getId().equals(profileUser.getId());
    }

    /**
     * Update the current user's profile picture
     * @param file the uploaded profile picture file
     * @return updated User entity
     * @throws IOException if file operations fail
     */
    @Transactional
    public User updateProfilePicture(MultipartFile file) throws IOException {
        User currentUser = getCurrentUser();
        
        // Create directory for user uploads if it doesn't exist
        String uploadDir = "uploads/profile-pictures/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate a unique filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = currentUser.getId() + "_" + System.currentTimeMillis() + fileExtension;
        
        // Save the file
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Update user profile picture path
        String fileUrl = "/profile-pictures/" + newFilename;
        currentUser.setProfilePicture(fileUrl);
        

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        System.out.println("File saved to: " + filePath.toAbsolutePath());
        return userRepository.save(currentUser);
    }




    @Transactional
public User updateCoverPhoto(MultipartFile file) throws IOException {
    User currentUser = getCurrentUser();
    
    // Create directory for user uploads if it doesn't exist
    String uploadDir = "uploads/cover-photos/";
    Path uploadPath = Paths.get(uploadDir);
    if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
    }
    
    // Generate a unique filename
    String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
    String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
    String newFilename = currentUser.getId() + "_cover_" + System.currentTimeMillis() + fileExtension;
    
    // Save the file
    Path filePath = uploadPath.resolve(newFilename);
    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
    
    // Update user cover photo path
    String fileUrl = "/cover-photos/" + newFilename;
    currentUser.setCoverPhoto(fileUrl);
    
    return userRepository.save(currentUser);
}

/**
 * Update the user's profile picture with an external URL
 * @param imageUrl The external URL to the profile picture
 * @return Updated User entity
 */
public User updateExternalProfilePicture(String imageUrl) {
    // Get the authenticated user
    User currentUser = getCurrentUser();
    if (currentUser == null) {
        throw new AccessDeniedException("Not authenticated");
    }
    
    // Set the profile picture URL
    currentUser.setProfilePicture(imageUrl);
    
    // Save the updated user
    return userRepository.save(currentUser);
}

/**
 * Update the user's cover photo with an external URL
 * @param imageUrl The external URL to the cover photo
 * @return Updated User entity
 */
public User updateExternalCoverPhoto(String imageUrl) {
    // Get the authenticated user
    User currentUser = getCurrentUser();
    if (currentUser == null) {
        throw new AccessDeniedException("Not authenticated");
    }
    
    // Set the cover photo URL
    currentUser.setCoverPhoto(imageUrl);
    
    // Save the updated user
    return userRepository.save(currentUser);
}



}