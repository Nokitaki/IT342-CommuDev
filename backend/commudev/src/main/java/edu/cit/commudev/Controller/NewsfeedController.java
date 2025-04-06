package edu.cit.commudev.controller;

import edu.cit.commudev.dto.NewsfeedRequestDTO;
import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.service.NewsfeedService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/newsfeed")
public class NewsfeedController {

    @Autowired
    private NewsfeedService newsfeedService;

    // Create post (requires authentication)
    @PostMapping("/create")
    public ResponseEntity<?> createNewsfeed(@RequestBody NewsfeedRequestDTO newsfeedRequestDTO) {
        try {
            // Convert the DTO to Entity
            NewsfeedEntity newsfeedEntity = new NewsfeedEntity();
            newsfeedEntity.setPostDescription(newsfeedRequestDTO.getPost_description());
            newsfeedEntity.setPostType(newsfeedRequestDTO.getPost_type());
            newsfeedEntity.setPostStatus(newsfeedRequestDTO.getPost_status());
            
            NewsfeedEntity createdNewsfeed = newsfeedService.createNewsfeed(newsfeedEntity);
            return new ResponseEntity<>(createdNewsfeed, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create post: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Get all posts (could be admin-only or paginated in production)
    @GetMapping("/all")
    public ResponseEntity<List<NewsfeedEntity>> getAllNewsfeeds() {
        List<NewsfeedEntity> newsfeeds = newsfeedService.getAllNewsfeeds();
        return new ResponseEntity<>(newsfeeds, HttpStatus.OK);
    }

    // Get current user's posts (requires authentication)
    @GetMapping("/my-posts")
    public ResponseEntity<?> getCurrentUserPosts() {
        try {
            List<NewsfeedEntity> posts = newsfeedService.getCurrentUserPosts();
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve your posts: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get posts by a specific username
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserPosts(@PathVariable String username) {
        try {
            List<NewsfeedEntity> posts = newsfeedService.getUserPostsByUsername(username);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Access denied: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error retrieving posts: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get one post by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getNewsfeedById(@PathVariable int id) {
        try {
            NewsfeedEntity newsfeed = newsfeedService.getNewsfeedById(id);
            return new ResponseEntity<>(newsfeed, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Post not found: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    // Update post (requires authentication and ownership)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateNewsfeed(@PathVariable int id, @RequestBody NewsfeedEntity newsfeedDetails) {
        try {
            NewsfeedEntity updatedNewsfeed = newsfeedService.updateNewsfeed(id, newsfeedDetails);
            return new ResponseEntity<>(updatedNewsfeed, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Access denied: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update post: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Like post (any authenticated user can like)
    @PatchMapping("/like/{id}")
    public ResponseEntity<?> likePost(@PathVariable int id) {
        try {
            NewsfeedEntity likedPost = newsfeedService.likePost(id);
            return new ResponseEntity<>(likedPost, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to like post: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete post (requires authentication and ownership)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNewsfeed(@PathVariable int id) {
        try {
            String message = newsfeedService.deleteNewsfeed(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Access denied: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete post: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Check if current user can edit a post
    @GetMapping("/can-edit/{id}")
    public ResponseEntity<?> canEditPost(@PathVariable int id) {
        boolean canEdit = newsfeedService.canEditPost(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("canEdit", canEdit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}