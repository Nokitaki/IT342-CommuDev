package edu.cit.commudev.repository;

import edu.cit.commudev.entity.NotificationEntity;
import edu.cit.commudev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    // Find notifications for a specific user, sorted by creation date (newest first)
    List<NotificationEntity> findByUserOrderByCreatedAtDesc(User user);
    
    // Find unread notifications for a specific user
    List<NotificationEntity> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    // Count unread notifications for a user
    long countByUserAndIsReadFalse(User user);
    
    // Find notifications related to a specific post
    List<NotificationEntity> findByRelatedPostId(Integer postId);
}