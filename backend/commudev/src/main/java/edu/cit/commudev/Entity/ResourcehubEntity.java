package edu.cit.commudev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;

@Entity
@Table(name = "resourcehub")
public class ResourcehubEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resource_id")
    private int resourceId;
    
    @Column(name = "resource_title")
    private String resourceTitle;
    
    @Column(name = "resource_description")
    private String resourceDescription;
    
    @Column(name = "upload_date")
    private ZonedDateTime uploadDate;
    
    @Column(name = "resource_category")
    private String resourceCategory;
    
    @Column(name = "heart_count")
    private int heartCount;
    
    @Column(name = "creator")
    private String creator;
    
    // Default constructor
    public ResourcehubEntity() {
        this.uploadDate = ZonedDateTime.now();
        this.heartCount = 0;
    }
    
    // Parameterized constructor
    public ResourcehubEntity(String resourceTitle, String resourceDescription, String resourceCategory, String creator) {
        this.resourceTitle = resourceTitle;
        this.resourceDescription = resourceDescription;
        this.resourceCategory = resourceCategory;
        this.creator = creator;
        this.uploadDate = ZonedDateTime.now();
        this.heartCount = 0;
    }
    
    // Getters and Setters
    public int getResourceId() {
        return resourceId;
    }
    
    public void setResourceId(int resourceId) {
        this.resourceId = resourceId;
    }
    
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
    
    public ZonedDateTime getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(ZonedDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
    
    public String getResourceCategory() {
        return resourceCategory;
    }
    
    public void setResourceCategory(String resourceCategory) {
        this.resourceCategory = resourceCategory;
    }
    
    public int getHeartCount() {
        return heartCount;
    }
    
    public void setHeartCount(int heartCount) {
        this.heartCount = heartCount;
    }
    
    public String getCreator() {
        return creator;
    }
    
    public void setCreator(String creator) {
        this.creator = creator;
    }
}