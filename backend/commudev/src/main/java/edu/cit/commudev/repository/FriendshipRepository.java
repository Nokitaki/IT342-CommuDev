package edu.cit.commudev.repository;

import edu.cit.commudev.entity.Friendship;
import edu.cit.commudev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    /**
     * Find a friendship between two specific users (directional)
     */
    List<Friendship> findByUserOneAndUserTwo(User userOne, User userTwo);
    
    /**
     * Find all friendships where the user is either user one or user two (to get all friends)
     */
    List<Friendship> findByUserOneOrUserTwo(User userOne, User userTwo);
    
    /**
     * Check if a friendship exists between two users (directional)
     */
    boolean existsByUserOneAndUserTwo(User userOne, User userTwo);
}