package edu.cit.commudev.Controller;

import edu.cit.commudev.Entity.ResourcehubEntity;
import edu.cit.commudev.Service.ResourcehubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resourcehub")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourcehubController {

    @Autowired
    private ResourcehubService resourcehubService;

    // Create
    @PostMapping("/create")
    public ResponseEntity<ResourcehubEntity> createResource(@RequestBody ResourcehubEntity resourceEntity) {
        ResourcehubEntity createdResource = resourcehubService.createResource(resourceEntity);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    // Read all
    @GetMapping("/all")
    public ResponseEntity<List<ResourcehubEntity>> getAllResources() {
        List<ResourcehubEntity> resources = resourcehubService.getAllResources();
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }

    // Read one
    @GetMapping("/{id}")
    public ResponseEntity<ResourcehubEntity> getResourceById(@PathVariable int id) {
        ResourcehubEntity resource = resourcehubService.getResourceById(id);
        return new ResponseEntity<>(resource, HttpStatus.OK);
    }
    
    // Find by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ResourcehubEntity>> getResourcesByCategory(@PathVariable String category) {
        List<ResourcehubEntity> resources = resourcehubService.getResourcesByCategory(category);
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }
    
    // Find by creator
    @GetMapping("/creator/{creator}")
    public ResponseEntity<List<ResourcehubEntity>> getResourcesByCreator(@PathVariable String creator) {
        List<ResourcehubEntity> resources = resourcehubService.getResourcesByCreator(creator);
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }
    
    // Search by title
    @GetMapping("/search")
    public ResponseEntity<List<ResourcehubEntity>> searchResources(@RequestParam String keyword) {
        List<ResourcehubEntity> resources = resourcehubService.searchResourcesByTitle(keyword);
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }

    // Update
    @PutMapping("/update/{id}")
    public ResponseEntity<ResourcehubEntity> updateResource(@PathVariable int id, @RequestBody ResourcehubEntity resourceDetails) {
        ResourcehubEntity updatedResource = resourcehubService.updateResource(id, resourceDetails);
        return new ResponseEntity<>(updatedResource, HttpStatus.OK);
    }

    // Heart (like) a resource
    @PatchMapping("/heart/{id}")
    public ResponseEntity<ResourcehubEntity> heartResource(@PathVariable int id) {
        ResourcehubEntity heartedResource = resourcehubService.heartResource(id);
        return new ResponseEntity<>(heartedResource, HttpStatus.OK);
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable int id) {
        String message = resourcehubService.deleteResource(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}