package edu.cit.commudev.repository;

import edu.cit.commudev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity data access.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Find a user by their email.
     *
     * @param email the email to search
     * @return Optional of User
     */
    Optional<User> findByEmail(String email);

    /**
     * Find a user by their username.
     *
     * @param username the username to search
     * @return Optional of User
     */
    Optional<User> findByUsername(String username);

    /**
     * Find a user by their verification code.
     *
     * @param verificationCode the verification code to search
     * @return Optional of User
     */
    Optional<User> findByVerificationCode(String verificationCode);

    /**
     * Check if a user exists with the given email.
     *
     * @param email the email to check
     * @return true if user exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if a user exists with the given username.
     *
     * @param username the username to check
     * @return true if user exists
     */
    boolean existsByUsername(String username);
}