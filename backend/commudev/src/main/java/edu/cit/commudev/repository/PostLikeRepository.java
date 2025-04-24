package edu.cit.commudev.repository;

import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.entity.PostLike;
import edu.cit.commudev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByUserAndPost(User user, NewsfeedEntity post);
    Optional<PostLike> findByUserAndPost(User user, NewsfeedEntity post);
    long countByPost(NewsfeedEntity post);
    boolean existsByUserIdAndPostNewsfeedId(Long userId, int postId);
    void deleteByPostNewsfeedId(int postId);
    
}