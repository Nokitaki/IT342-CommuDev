package edu.cit.commudev.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "typing_status")
@Data
@NoArgsConstructor
public class TypingStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "is_typing")
    private boolean typing;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.timestamp = LocalDateTime.now();
    }
}