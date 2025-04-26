package edu.cit.commudev.repository;

import edu.cit.commudev.entity.FriendRequest;
import edu.cit.commudev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    
    /**
     * Find all friend requests where the user is the receiver and the status is as specified
     */
    List<FriendRequest> findByReceiverAndStatus(User receiver, String status);
    
    /**
     * Find all friend requests where the user is the sender and the status is as specified
     */
    List<FriendRequest> findBySenderAndStatus(User sender, String status);
    
    /**
     * Find a specific friend request between sender and receiver with specified status
     */
    Optional<FriendRequest> findBySenderAndReceiverAndStatus(User sender, User receiver, String status);
    
    /**
     * Check if a request exists between two users with any status
     */
    boolean existsBySenderAndReceiver(User sender, User receiver);
}