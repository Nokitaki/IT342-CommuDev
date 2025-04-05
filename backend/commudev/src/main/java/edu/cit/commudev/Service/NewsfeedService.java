package edu.cit.commudev.service;

import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.repository.NewsfeedRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class NewsfeedService {

    @Autowired
    private NewsfeedRepo newsfeedRepo;

    // Create
    public NewsfeedEntity createNewsfeed(NewsfeedEntity newsfeed) {
        return newsfeedRepo.save(newsfeed);
    }

    // Read all
    public List<NewsfeedEntity> getAllNewsfeeds() {
        return newsfeedRepo.findAll();
    }

    // Read one
    public NewsfeedEntity getNewsfeedById(int id) {
        return newsfeedRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Newsfeed with ID: " + id + " not found"));
    }

    // Update
    public NewsfeedEntity updateNewsfeed(int id, NewsfeedEntity newsfeedDetails) {
        NewsfeedEntity existingNewsfeed = getNewsfeedById(id);
        
        // Update fields
        existingNewsfeed.setPost_description(newsfeedDetails.getPost_description());
        existingNewsfeed.setPost_type(newsfeedDetails.getPost_type());
        if (newsfeedDetails.getPost_date() != null) {
            existingNewsfeed.setPost_date(newsfeedDetails.getPost_date());
        }
        existingNewsfeed.setLike_count(newsfeedDetails.getLike_count());
        existingNewsfeed.setPost_status(newsfeedDetails.getPost_status());
        
        return newsfeedRepo.save(existingNewsfeed);
    }

    // Like post
    public NewsfeedEntity likePost(int id) {
        NewsfeedEntity newsfeed = getNewsfeedById(id);
        newsfeed.setLike_count(newsfeed.getLike_count() + 1);
        return newsfeedRepo.save(newsfeed);
    }

    // Delete
    public String deleteNewsfeed(int id) {
        if (newsfeedRepo.existsById(id)) {
            newsfeedRepo.deleteById(id);
            return "Newsfeed with ID: " + id + " successfully deleted";
        } else {
            return "Newsfeed with ID: " + id + " not found";
        }
    }
}