package edu.cit.commudev.dto;

public class ResourcehubRequestDTO {
    
    private String resourceTitle;
    private String resourceDescription;
    private String resourceCategory;
    private String creator;
    
    // Default constructor
    public ResourcehubRequestDTO() {
    }
    
    // Constructor with essential fields
    public ResourcehubRequestDTO(String resourceTitle, String resourceDescription, String resourceCategory, String creator) {
        this.resourceTitle = resourceTitle;
        this.resourceDescription = resourceDescription;
        this.resourceCategory = resourceCategory;
        this.creator = creator;
    }
    
    // Getters and Setters
    public String getResourceTitle() {
        return resourceTitle;
    }
    
    public void setResourceTitle(String resourceTitle) {
        this.resourceTitle = resourceTitle;
    }
    
    public String getResourceDescription() {
        return resourceDescription;
    }
    
    public void setResourceDescription(String resourceDescription) {
        this.resourceDescription = resourceDescription;
    }
    
    public String getResourceCategory() {
        return resourceCategory;
    }
    
    public void setResourceCategory(String resourceCategory) {
        this.resourceCategory = resourceCategory;
    }
    
    public String getCreator() {
        return creator;
    }
    
    public void setCreator(String creator) {
        this.creator = creator;
    }
}