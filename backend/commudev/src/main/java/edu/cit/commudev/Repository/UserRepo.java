package edu.cit.commudev.Repository;

import edu.cit.commudev.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Integer> {
    
    // Find user by username
    Optional<UserEntity> findByUsername(String username);
    
    // Find user by email
    Optional<UserEntity> findByEmail(String email);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find users by name (useful for search functionality)
    java.util.List<UserEntity> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
        String firstname, String lastname);
}