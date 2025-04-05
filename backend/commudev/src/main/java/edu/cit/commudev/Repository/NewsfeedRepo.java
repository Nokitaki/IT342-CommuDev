package edu.cit.commudev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.commudev.entity.NewsfeedEntity;

@Repository
public interface NewsfeedRepo extends JpaRepository<NewsfeedEntity, Integer> {
    // No additional methods needed for basic CRUD operations
}