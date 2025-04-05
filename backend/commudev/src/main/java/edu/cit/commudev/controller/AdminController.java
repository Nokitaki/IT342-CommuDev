package edu.cit.commudev.controller;

import edu.cit.commudev.dto.UserDto;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for administrative operations.
 * All endpoints require ADMIN role.
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserService userService;

    /**
     * Constructor for AdminController.
     *
     * @param userService service for user operations
     */
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get all users in the system.
     *
     * @return list of all users
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.allUsers();
        List<UserDto> userDtos = users.stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.isEnabled()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    /**
     * Enable or disable a user account.
     *
     * @param userId user ID
     * @param enabled true to enable, false to disable
     * @return response with the updated user
     */
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> setUserStatus(@PathVariable Long userId, @RequestParam boolean enabled) {
        try {
            User user = userService.setUserEnabled(userId, enabled);
            UserDto userDto = new UserDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.isEnabled()
            );
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user status: " + e.getMessage());
        }
    }

    /**
     * Get system statistics for administrators.
     *
     * @return system statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.countUsers());
        stats.put("activeUsers", userService.countActiveUsers());
        stats.put("verifiedUserPercentage", userService.getVerificationRate());
        // Add more statistics as needed
        return ResponseEntity.ok(stats);
    }




}