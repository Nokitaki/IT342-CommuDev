package edu.cit.commudev.repository;

import edu.cit.commudev.entity.CommentEntity;
import edu.cit.commudev.entity.NewsfeedEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    // Find comments by post
    List<CommentEntity> findByPost(NewsfeedEntity post);
    
    // Find comments by post ID
    List<CommentEntity> findByPostNewsfeedId(int newsfeedId);
    
    // Find comments by user ID
    List<CommentEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Count comments for a post
    long countByPostNewsfeedId(int newsfeedId);
}