package edu.cit.commudev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.entity.User;

import java.util.List;

@Repository
public interface NewsfeedRepo extends JpaRepository<NewsfeedEntity, Integer> {
    // Find posts by user object
    List<NewsfeedEntity> findByUser(User user);
    
    // Find posts by user ID
    List<NewsfeedEntity> findByUserId(Long userId);
    
    // Find posts by username
    List<NewsfeedEntity> findByUserUsername(String username);
    
    // Find active posts by user
    List<NewsfeedEntity> findByUserAndPostStatus(User user, String status);
}