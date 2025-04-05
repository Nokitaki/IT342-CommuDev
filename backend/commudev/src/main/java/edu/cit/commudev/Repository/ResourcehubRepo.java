package edu.cit.commudev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.commudev.entity.ResourcehubEntity;

import java.util.List;

@Repository
public interface ResourcehubRepo extends JpaRepository<ResourcehubEntity, Integer> {
    // Find resources by category
    List<ResourcehubEntity> findByResourceCategory(String resourceCategory);
    
    // Find resources by creator
    List<ResourcehubEntity> findByCreator(String creator);
    
    // Find resources by title containing keyword
    List<ResourcehubEntity> findByResourceTitleContainingIgnoreCase(String keyword);
}