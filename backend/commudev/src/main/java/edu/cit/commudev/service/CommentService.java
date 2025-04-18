package edu.cit.commudev.service;

import edu.cit.commudev.entity.CommentEntity;
import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.CommentRepository;
import edu.cit.commudev.repository.NewsfeedRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private NewsfeedRepo newsfeedRepo;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationService notificationService; // Added NotificationService

    // Create a new comment
    public CommentEntity createComment(String commentText, int postId) {
        // Get the current authenticated user
        User currentUser = userService.getCurrentUser();
        
        // Find the post
        NewsfeedEntity post = newsfeedRepo.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post with ID: " + postId + " not found"));
        
        // Create and save the comment
        CommentEntity comment = new CommentEntity();
        comment.setCommentText(commentText);
        comment.setUser(currentUser);
        comment.setPost(post);
        
        CommentEntity savedComment = commentRepository.save(comment);
        
        // Create notification for the post owner
        notificationService.createCommentNotification(savedComment, post);
        
        return savedComment;
    }

    // Get all comments for a post
    public List<CommentEntity> getCommentsByPostId(int postId) {
        return commentRepository.findByPostNewsfeedId(postId);
    }

    // Get comment by ID
    public CommentEntity getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment with ID: " + commentId + " not found"));
    }

    // Update a comment (only by the owner)
    public CommentEntity updateComment(Long commentId, String newText) {
        // Get current user
        User currentUser = userService.getCurrentUser();
        
        // Get the comment
        CommentEntity comment = getCommentById(commentId);
        
        // Check if the current user is the owner
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to update this comment");
        }
        
        // Update and save
        comment.setCommentText(newText);
        return commentRepository.save(comment);
    }

    // Delete a comment (only by the owner or post owner)
    public void deleteComment(Long commentId) {
        // Get current user
        User currentUser = userService.getCurrentUser();
        
        // Get the comment
        CommentEntity comment = getCommentById(commentId);
        
        // Check if the current user is the comment owner or post owner
        if (!comment.getUser().getId().equals(currentUser.getId()) && 
            !comment.getPost().getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to delete this comment");
        }
        
        // Delete the comment
        commentRepository.deleteById(commentId);
    }

    // Get comments by current user
    public List<CommentEntity> getCurrentUserComments() {
        User currentUser = userService.getCurrentUser();
        return commentRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }
    
    // Count comments for a post
    public long countCommentsByPostId(int postId) {
        return commentRepository.countByPostNewsfeedId(postId);
    }
}