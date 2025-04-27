package edu.cit.commudev.controller;

import edu.cit.commudev.entity.FriendRequest;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "https://it-342-commu-dev.vercel.app")
public class FriendController {

    @Autowired
    private FriendService friendService;

    // Get all friends for the current user
    @GetMapping
    public ResponseEntity<?> getFriends() {
        try {
            List<User> friends = friendService.getFriends();
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve friends: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Send a friend request
    @PostMapping("/request/{userId}")
    public ResponseEntity<?> sendFriendRequest(@PathVariable Long userId) {
        try {
            FriendRequest request = friendService.sendFriendRequest(userId);
            return ResponseEntity.ok(request);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (AccessDeniedException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Access denied: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to send friend request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Get all pending friend requests for the current user
    @GetMapping("/requests/pending")
    public ResponseEntity<?> getPendingRequests() {
        try {
            List<FriendRequest> requests = friendService.getPendingRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve pending requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Accept a friend request
    @PutMapping("/request/{requestId}/accept")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Long requestId) {
        try {
            friendService.acceptFriendRequest(requestId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Friend request accepted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (AccessDeniedException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Access denied: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to accept friend request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Reject a friend request
    @PutMapping("/request/{requestId}/reject")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable Long requestId) {
        try {
            friendService.rejectFriendRequest(requestId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Friend request rejected successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (AccessDeniedException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Access denied: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to reject friend request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Remove a friend
    @DeleteMapping("/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long friendId) {
        try {
            friendService.removeFriend(friendId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Friend removed successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (AccessDeniedException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Access denied: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to remove friend: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Check if a user is a friend
    @GetMapping("/check/{userId}")
    public ResponseEntity<?> checkFriendStatus(@PathVariable Long userId) {
        try {
            boolean isFriend = friendService.isFriend(userId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("isFriend", isFriend);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to check friend status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}