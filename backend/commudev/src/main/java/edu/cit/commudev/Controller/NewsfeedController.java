package edu.cit.commudev.controller;

import edu.cit.commudev.dto.NewsfeedRequestDTO;
import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.service.NewsfeedService;
import edu.cit.commudev.entity.User;

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
@CrossOrigin(origins = {"http://localhost:5173", "https://it-342-commu-dev-v675-git-master-nokitakis-projects.vercel.app", "https://it-342-commu-dev-v675.vercel.app"})
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
    public ResponseEntity<?> getAllNewsfeeds() {
        try {
            List<NewsfeedEntity> newsfeeds = newsfeedService.getAllNewsfeeds();
            return new ResponseEntity<>(newsfeeds, HttpStatus.OK);
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace();
            
            // Return a more informative error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve posts: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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



    @PutMapping("/update-simple/{id}")
public ResponseEntity<?> updateNewsfeedSimple(
        @PathVariable int id,
        @RequestParam String postDescription,
        @RequestParam String postType,
        @RequestParam String postStatus) {
    try {
        // Create a new entity with the parameters
        NewsfeedEntity newsfeedDetails = new NewsfeedEntity();
        newsfeedDetails.setPostDescription(postDescription);
        newsfeedDetails.setPostType(postType);
        newsfeedDetails.setPostStatus(postStatus);
        
        // Call the existing service method
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

    // Toggle like on a post (any authenticated user can like)
    @PatchMapping("/like/{id}")
    public ResponseEntity<?> toggleLikePost(@PathVariable int id) {
        try {
            NewsfeedEntity likedPost = newsfeedService.toggleLike(id);
            
            // Get additional like status information
            Map<String, Object> likeStatus = newsfeedService.getLikeStatus(id);
            
            // Create response with post and like status
            Map<String, Object> response = new HashMap<>();
            response.put("post", likedPost);
            response.put("liked", likeStatus.get("liked"));
            response.put("likeCount", likeStatus.get("likeCount"));
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to toggle like: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Check if user has liked a post
    @GetMapping("/liked/{id}")
    public ResponseEntity<?> checkUserLiked(@PathVariable int id) {
        try {
            boolean hasLiked = newsfeedService.hasUserLikedPost(id);
            Map<String, Object> response = new HashMap<>();
            response.put("liked", hasLiked);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to check like status: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get like status for a post
    @GetMapping("/like-status/{id}")
    public ResponseEntity<?> getLikeStatus(@PathVariable int id) {
        Map<String, Object> likeStatus = newsfeedService.getLikeStatus(id);
        return new ResponseEntity<>(likeStatus, HttpStatus.OK);
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






    @DeleteMapping("/delete-with-related/{id}")
    public ResponseEntity<?> deleteNewsfeedWithRelated(@PathVariable int id) {
        try {
            // Check if post exists and user has permission to delete it
            NewsfeedEntity post = newsfeedService.getNewsfeedById(id);
            
            // Get current authenticated user
            User currentUser = newsfeedService.getCurrentUser();
            
            // Check if the current user owns this post
            if (!post.getUser().getId().equals(currentUser.getId())) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "You don't have permission to delete this post");
                return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
            }
            
            // Create a service method to handle complete deletion with all related entities
            boolean deleted = newsfeedService.deleteWithRelated(id);
            
            if (deleted) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Post and all related content deleted successfully");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Failed to delete post");
                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
            }
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
}