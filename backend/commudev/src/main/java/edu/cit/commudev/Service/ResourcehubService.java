package edu.cit.commudev.Service;

import edu.cit.commudev.Entity.ResourcehubEntity;
import edu.cit.commudev.Repository.ResourcehubRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ResourcehubService {

    @Autowired
    private ResourcehubRepo resourcehubRepo;

    // Create
    public ResourcehubEntity createResource(ResourcehubEntity resource) {
        return resourcehubRepo.save(resource);
    }

    // Read all
    public List<ResourcehubEntity> getAllResources() {
        return resourcehubRepo.findAll();
    }

    // Read one
    public ResourcehubEntity getResourceById(int id) {
        return resourcehubRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource with ID: " + id + " not found"));
    }
    
    // Find by category
    public List<ResourcehubEntity> getResourcesByCategory(String category) {
        return resourcehubRepo.findByResourceCategory(category);
    }
    
    // Find by creator
    public List<ResourcehubEntity> getResourcesByCreator(String creator) {
        return resourcehubRepo.findByCreator(creator);
    }
    
    // Search by title
    public List<ResourcehubEntity> searchResourcesByTitle(String keyword) {
        return resourcehubRepo.findByResourceTitleContainingIgnoreCase(keyword);
    }

    // Update
    public ResourcehubEntity updateResource(int id, ResourcehubEntity resourceDetails) {
        ResourcehubEntity existingResource = getResourceById(id);
        
        // Update fields
        existingResource.setResourceTitle(resourceDetails.getResourceTitle());
        existingResource.setResourceDescription(resourceDetails.getResourceDescription());
        existingResource.setResourceCategory(resourceDetails.getResourceCategory());
        existingResource.setCreator(resourceDetails.getCreator());
        
        return resourcehubRepo.save(existingResource);
    }

    // Heart (like) a resource
    public ResourcehubEntity heartResource(int id) {
        ResourcehubEntity resource = getResourceById(id);
        resource.setHeartCount(resource.getHeartCount() + 1);
        return resourcehubRepo.save(resource);
    }

    // Delete
    public String deleteResource(int id) {
        if (resourcehubRepo.existsById(id)) {
            resourcehubRepo.deleteById(id);
            return "Resource with ID: " + id + " successfully deleted";
        } else {
            return "Resource with ID: " + id + " not found";
        }
    }
}