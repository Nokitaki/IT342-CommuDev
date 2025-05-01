package edu.cit.commudev.repository;

import edu.cit.commudev.entity.TypingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TypingStatusRepository extends JpaRepository<TypingStatus, Long> {
    List<TypingStatus> findByConversationIdAndTypingTrue(Long conversationId);
    
    Optional<TypingStatus> findByConversationIdAndUserId(Long conversationId, Long userId);
}