package edu.cit.commudev.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;
    
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    
    @Column(columnDefinition = "TEXT")
    private String text;
    
    @Column(name = "is_read")
    private boolean read;
    
    @Column(name = "is_edited")
    private boolean edited;
    
    @Column(name = "edited_at")
    private LocalDateTime editedAt;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
        this.read = false;
        this.edited = false;
    }
}