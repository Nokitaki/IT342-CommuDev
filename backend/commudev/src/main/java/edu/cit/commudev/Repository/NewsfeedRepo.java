package edu.cit.commudev.Repository;

import edu.cit.commudev.Entity.NewsfeedEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsfeedRepo extends JpaRepository<NewsfeedEntity, Integer> {
    // No additional methods needed for basic CRUD operations
}