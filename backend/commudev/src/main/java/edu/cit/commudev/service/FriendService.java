package edu.cit.commudev.service;

import edu.cit.commudev.entity.FriendRequest;
import edu.cit.commudev.entity.Friendship;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.FriendRequestRepository;
import edu.cit.commudev.repository.FriendshipRepository;
import edu.cit.commudev.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    
    @Autowired
    private FriendshipRepository friendshipRepository;
    
    @Autowired
    private NotificationService notificationService;

    /**
     * Get the currently authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("No authenticated user found");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
    }

    /**
     * Get all friends of the current user
     */
    public List<User> getFriends() {
        User currentUser = getCurrentUser();
        List<Friendship> friendships = friendshipRepository.findByUserOneOrUserTwo(currentUser, currentUser);
        
        List<User> friends = new ArrayList<>();
        for (Friendship friendship : friendships) {
            if (friendship.getUserOne().getId().equals(currentUser.getId())) {
                friends.add(friendship.getUserTwo());
            } else {
                friends.add(friendship.getUserOne());
            }
        }
        
        return friends;
    }

    /**
     * Send a friend request to another user
     */
    @Transactional
    public FriendRequest sendFriendRequest(Long userId) {
        // Get the current user
        User currentUser = getCurrentUser();
        
        // Get the target user
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Check if the target user is not the current user
        if (currentUser.getId().equals(targetUser.getId())) {
            throw new IllegalArgumentException("You cannot send a friend request to yourself");
        }
        
        // Check if they are already friends
        boolean alreadyFriends = isFriend(targetUser.getId());
        if (alreadyFriends) {
            throw new IllegalArgumentException("You are already friends with this user");
        }
        
        // Check if there's already a pending request between these users
        Optional<FriendRequest> existingRequest = friendRequestRepository
                .findBySenderAndReceiverAndStatus(currentUser, targetUser, "PENDING");
        if (existingRequest.isPresent()) {
            throw new IllegalArgumentException("You have already sent a friend request to this user");
        }
        
        // Check if there's already a pending request from the target user
        existingRequest = friendRequestRepository
                .findBySenderAndReceiverAndStatus(targetUser, currentUser, "PENDING");
        if (existingRequest.isPresent()) {
            // If there is, accept it instead of creating a new request
            return acceptFriendRequest(existingRequest.get().getId());
        }
        
        // Create a new friend request
        FriendRequest friendRequest = new FriendRequest();
        friendRequest.setSender(currentUser);
        friendRequest.setReceiver(targetUser);
        friendRequest.setStatus("PENDING");
        friendRequest.setCreatedAt(LocalDateTime.now());
        
        // Save the request
        FriendRequest savedRequest = friendRequestRepository.save(friendRequest);
        
        // Create a notification for the receiver
        notificationService.createFriendRequestNotification(savedRequest);
        
        return savedRequest;
    }

    /**
     * Get all pending friend requests for the current user
     */
    public List<FriendRequest> getPendingRequests() {
        User currentUser = getCurrentUser();
        return friendRequestRepository.findByReceiverAndStatus(currentUser, "PENDING");
    }

    /**
     * Accept a friend request
     */
    @Transactional
    public FriendRequest acceptFriendRequest(Long requestId) {
        // Get the current user
        User currentUser = getCurrentUser();
        
        // Find the friend request
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));
        
        // Verify that the current user is the receiver of the request
        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only accept friend requests sent to you");
        }
        
        // Verify that the request is pending
        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("This friend request has already been processed");
        }
        
        // Update the request status
        request.setStatus("ACCEPTED");
        request.setUpdatedAt(LocalDateTime.now());
        
        // Create a friendship
        Friendship friendship = new Friendship();
        friendship.setUserOne(request.getSender());
        friendship.setUserTwo(request.getReceiver());
        friendship.setCreatedAt(LocalDateTime.now());
        
        // Save both entities
        friendshipRepository.save(friendship);
        FriendRequest savedRequest = friendRequestRepository.save(request);
        
        // Create a notification for the sender
        notificationService.createFriendRequestAcceptedNotification(savedRequest);
        
        return savedRequest;
    }

    /**
     * Reject a friend request
     */
    @Transactional
    public FriendRequest rejectFriendRequest(Long requestId) {
        // Get the current user
        User currentUser = getCurrentUser();
        
        // Find the friend request
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));
        
        // Verify that the current user is the receiver of the request
        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only reject friend requests sent to you");
        }
        
        // Verify that the request is pending
        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("This friend request has already been processed");
        }
        
        // Update the request status
        request.setStatus("REJECTED");
        request.setUpdatedAt(LocalDateTime.now());
        
        // Save the updated request
        return friendRequestRepository.save(request);
    }

    /**
     * Remove a friend
     */
    @Transactional
    public void removeFriend(Long friendId) {
        // Get the current user
        User currentUser = getCurrentUser();
        
        // Get the friend user
        User friendUser = userRepository.findById(friendId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Find the friendship
        List<Friendship> friendships = friendshipRepository.findByUserOneAndUserTwo(currentUser, friendUser);
        friendships.addAll(friendshipRepository.findByUserOneAndUserTwo(friendUser, currentUser));
        
        if (friendships.isEmpty()) {
            throw new IllegalArgumentException("This user is not your friend");
        }
        
        // Delete all the friendships found
        for (Friendship friendship : friendships) {
            friendshipRepository.delete(friendship);
        }
    }

    /**
     * Check if a user is a friend of the current user
     */
    public boolean isFriend(Long userId) {
        User currentUser = getCurrentUser();
        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<Friendship> friendships = friendshipRepository.findByUserOneAndUserTwo(currentUser, otherUser);
        friendships.addAll(friendshipRepository.findByUserOneAndUserTwo(otherUser, currentUser));
        
        return !friendships.isEmpty();
    }
}