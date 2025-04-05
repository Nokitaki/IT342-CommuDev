package edu.cit.commudev.controller;

import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.service.NewsfeedService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/newsfeed")
@CrossOrigin(origins = "http://localhost:5173")
public class NewsfeedController {

    @Autowired
    private NewsfeedService newsfeedService;

    // Create
    @PostMapping("/create")
    public ResponseEntity<NewsfeedEntity> createNewsfeed(@RequestBody NewsfeedEntity newsfeedEntity) {
        NewsfeedEntity createdNewsfeed = newsfeedService.createNewsfeed(newsfeedEntity);
        return new ResponseEntity<>(createdNewsfeed, HttpStatus.CREATED);
    }

    // Read all
    @GetMapping("/all")
    public ResponseEntity<List<NewsfeedEntity>> getAllNewsfeeds() {
        List<NewsfeedEntity> newsfeeds = newsfeedService.getAllNewsfeeds();
        return new ResponseEntity<>(newsfeeds, HttpStatus.OK);
    }

    // Read one
    @GetMapping("/{id}")
    public ResponseEntity<NewsfeedEntity> getNewsfeedById(@PathVariable int id) {
        NewsfeedEntity newsfeed = newsfeedService.getNewsfeedById(id);
        return new ResponseEntity<>(newsfeed, HttpStatus.OK);
    }

    // Update
    @PutMapping("/update/{id}")
    public ResponseEntity<NewsfeedEntity> updateNewsfeed(@PathVariable int id, @RequestBody NewsfeedEntity newsfeedDetails) {
        NewsfeedEntity updatedNewsfeed = newsfeedService.updateNewsfeed(id, newsfeedDetails);
        return new ResponseEntity<>(updatedNewsfeed, HttpStatus.OK);
    }

    // Like post
    @PatchMapping("/like/{id}")
    public ResponseEntity<NewsfeedEntity> likePost(@PathVariable int id) {
        NewsfeedEntity likedPost = newsfeedService.likePost(id);
        return new ResponseEntity<>(likedPost, HttpStatus.OK);
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNewsfeed(@PathVariable int id) {
        String message = newsfeedService.deleteNewsfeed(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}