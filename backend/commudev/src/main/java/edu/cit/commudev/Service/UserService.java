package edu.cit.commudev.service;

import edu.cit.commudev.entity.Role;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.RoleRepository;
import edu.cit.commudev.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.context.annotation.Primary;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

/**
 * Service for user management.
 * Implements UserDetailsService for Spring Security integration.
 */
@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

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
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("No authenticated user found");
        }

        String username = authentication.getName();

        // Try to find by username first (since we're using username for auth)
        Optional<User> userByUsername = findByUsername(username);
        if (userByUsername.isPresent()) {
            return userByUsername.get();
        }

        // If not found by username, try by email
        Optional<User> userByEmail = findByEmail(username);
        if (userByEmail.isPresent()) {
            return userByEmail.get();
        }

        throw new EntityNotFoundException("Authenticated user not found in database");
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


}