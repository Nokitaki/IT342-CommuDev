package edu.cit.commudev.dto;

public class CommentRequestDTO {
    
    private String commentText;
    private int postId;
    
    // Default constructor
    public CommentRequestDTO() {
    }
    
    // Constructor with fields
    public CommentRequestDTO(String commentText, int postId) {
        this.commentText = commentText;
        this.postId = postId;
    }
    
    // Getters and Setters
    public String getCommentText() {
        return commentText;
    }
    
    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
    
    public int getPostId() {
        return postId;
    }
    
    public void setPostId(int postId) {
        this.postId = postId;
    }
}