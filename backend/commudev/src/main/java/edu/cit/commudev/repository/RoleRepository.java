package edu.cit.commudev.repository;

import edu.cit.commudev.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for accessing Role entities.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Find a role by its name.
     *
     * @param name the role name
     * @return an Optional containing the role if found
     */
    Optional<Role> findByName(String name);
}