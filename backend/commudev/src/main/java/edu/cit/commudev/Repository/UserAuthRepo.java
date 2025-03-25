package edu.cit.commudev.Repository;

import edu.cit.commudev.Entity.UserAuthEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserAuthRepo extends JpaRepository<UserAuthEntity, Integer> {
    
    // Find auth by username
    Optional<UserAuthEntity> findByUsername(String username);
    
    // Check if username exists in auth table
    boolean existsByUsername(String username);
}