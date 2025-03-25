package edu.cit.commudev.Dto;

public class NewsfeedRequestDTO {
    
    private String post_description;
    private String post_type;
    private String post_status;
    
    // Default constructor
    public NewsfeedRequestDTO() {
    }
    
    // Constructor with essential fields
    public NewsfeedRequestDTO(String post_description, String post_type) {
        this.post_description = post_description;
        this.post_type = post_type;
        this.post_status = "active";
    }
    
    // Getters and Setters
    public String getPost_description() {
        return post_description;
    }
    
    public void setPost_description(String post_description) {
        this.post_description = post_description;
    }
    
    public String getPost_type() {
        return post_type;
    }
    
    public void setPost_type(String post_type) {
        this.post_type = post_type;
    }
    
    public String getPost_status() {
        return post_status;
    }
    
    public void setPost_status(String post_status) {
        this.post_status = post_status;
    }
}