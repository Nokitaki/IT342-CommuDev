package edu.cit.commudev.service;

import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.entity.PostLike;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.CommentRepository;
import edu.cit.commudev.repository.NewsfeedRepo;
import edu.cit.commudev.repository.PostLikeRepository;
import edu.cit.commudev.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Service
public class NewsfeedService {

    @Autowired
    private NewsfeedRepo newsfeedRepo;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private PostLikeRepository postLikeRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Create post with authenticated user
    public NewsfeedEntity createNewsfeed(NewsfeedEntity newsfeed) {
        // Get the current authenticated user
        User currentUser = userService.getCurrentUser();
        
        // Set the user to the post
        newsfeed.setUser(currentUser);
        
        // Save and return the post
        return newsfeedRepo.save(newsfeed);
    }

    // Read all posts (could be restricted to admins or paginated in production)
    public List<NewsfeedEntity> getAllNewsfeeds() {
        return newsfeedRepo.findAll();
    }

    // Read posts by current authenticated user
    public List<NewsfeedEntity> getCurrentUserPosts() {
        User currentUser = userService.getCurrentUser();
        return newsfeedRepo.findByUser(currentUser);
    }
    
    // Read posts by a specific username
    public List<NewsfeedEntity> getUserPostsByUsername(String username) {
        // This should check profile visibility, but we'll implement that in a bit
        return newsfeedRepo.findByUserUsername(username);
    }

    // Read one post by ID
    public NewsfeedEntity getNewsfeedById(int id) {
        return newsfeedRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Newsfeed with ID: " + id + " not found"));
    }

    // Update post with owner check
    public NewsfeedEntity updateNewsfeed(int id, NewsfeedEntity newsfeedDetails) {
        // Get the existing post
        NewsfeedEntity existingNewsfeed = getNewsfeedById(id);
        
        // Get current authenticated user
        User currentUser = userService.getCurrentUser();
        
        // Check if the current user owns this post
        if (!existingNewsfeed.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to update this post");
        }
        
        // Update fields, but keep the original user, post date, etc.
        existingNewsfeed.setPostDescription(newsfeedDetails.getPostDescription());
        existingNewsfeed.setPostType(newsfeedDetails.getPostType());
        existingNewsfeed.setPostStatus(newsfeedDetails.getPostStatus());
        
        // Save and return updated post
        return newsfeedRepo.save(existingNewsfeed);
    }

    // Toggle like a post (any user can like)
    @Transactional
    public NewsfeedEntity toggleLike(int id) {
        // Get the existing post
        NewsfeedEntity post = getNewsfeedById(id);
        
        // Get current authenticated user
        User currentUser = userService.getCurrentUser();
        
        // Check if the user has already liked this post
        boolean hasLiked = postLikeRepository.existsByUserAndPost(currentUser, post);
        
        if (hasLiked) {
            // Unlike: Remove the like
            Optional<PostLike> existingLike = postLikeRepository.findByUserAndPost(currentUser, post);
            existingLike.ifPresent(like -> postLikeRepository.delete(like));
            
            // Update like count
            long likeCount = postLikeRepository.countByPost(post);
            post.setLikeCount((int) likeCount);
        } else {
            // Like: Create a new like
            PostLike newLike = new PostLike(currentUser, post);
            postLikeRepository.save(newLike);
            
            // Create notification for the post owner (only when liking)
            notificationService.createLikeNotification(post, currentUser);
            
            // Update like count
            long likeCount = postLikeRepository.countByPost(post);
            post.setLikeCount((int) likeCount);
        }
        
        return newsfeedRepo.save(post);
    }
    
    // Check if current user has liked a post
    public boolean hasUserLikedPost(int postId) {
        try {
            User currentUser = userService.getCurrentUser();
            return postLikeRepository.existsByUserIdAndPostNewsfeedId(currentUser.getId(), postId);
        } catch (Exception e) {
            return false;
        }
    }

    // Delete post with owner check
    public String deleteNewsfeed(int id) {
        // Get the existing post
        NewsfeedEntity existingNewsfeed = getNewsfeedById(id);
        
        // Get current authenticated user
        User currentUser = userService.getCurrentUser();
        
        // Check if the current user owns this post
        if (!existingNewsfeed.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to delete this post");
        }
        
        // Delete the post
        newsfeedRepo.deleteById(id);
        return "Newsfeed with ID: " + id + " successfully deleted";
    }
    
    // Check if a user can edit a specific post
    public boolean canEditPost(int postId) {
        try {
            NewsfeedEntity post = getNewsfeedById(postId);
            User currentUser = userService.getCurrentUser();
            return post.getUser().getId().equals(currentUser.getId());
        } catch (Exception e) {
            return false;
        }
    }
    
    // Get like status for a post
    public Map<String, Object> getLikeStatus(int postId) {
        Map<String, Object> result = new HashMap<>();
        try {
            NewsfeedEntity post = getNewsfeedById(postId);
            User currentUser = userService.getCurrentUser();
            
            boolean userLiked = postLikeRepository.existsByUserAndPost(currentUser, post);
            long likeCount = postLikeRepository.countByPost(post);
            
            result.put("liked", userLiked);
            result.put("likeCount", likeCount);
            return result;
        } catch (Exception e) {
            result.put("liked", false);
            result.put("likeCount", 0);
            return result;
        }
    }

    /**
     * Delete a post and all related entities (comments and likes)
     * @param id Post ID to delete
     * @return True if deletion was successful
     */
    @Transactional
    public boolean deleteWithRelated(int id) {
        try {
            // Get the post to verify it exists
            NewsfeedEntity post = getNewsfeedById(id);
            
            // Get current authenticated user
            User currentUser = getCurrentUser();
            
            // Check if the current user owns this post
            if (!post.getUser().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You don't have permission to delete this post");
            }
            
            // First delete all likes for this post
            postLikeRepository.deleteByPostNewsfeedId(id);
            
            // Then delete all comments for this post
            commentRepository.deleteByPostNewsfeedId(id);
            
            // Finally delete the post
            newsfeedRepo.deleteById(id);
            
            return true;
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace();
            return false;
        }
    }

    // Get the currently authenticated user
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("No authenticated user found");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
    }
}