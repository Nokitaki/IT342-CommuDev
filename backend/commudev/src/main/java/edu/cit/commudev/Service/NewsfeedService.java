package edu.cit.commudev.service;

import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.NewsfeedRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class NewsfeedService {

    @Autowired
    private NewsfeedRepo newsfeedRepo;
    
    @Autowired
    private UserService userService;

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

    // Like a post (any user can like)
    public NewsfeedEntity likePost(int id) {
        NewsfeedEntity newsfeed = getNewsfeedById(id);
        newsfeed.setLikeCount(newsfeed.getLikeCount() + 1);
        return newsfeedRepo.save(newsfeed);
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
}