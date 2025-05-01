package edu.cit.commudev.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String lastMessage;
    
    @Column(name = "last_sender_id")
    private Long lastSenderId;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConversationParticipant> participants = new ArrayList<>();
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Helper method to add a participant
    public void addParticipant(User user) {
        ConversationParticipant participant = new ConversationParticipant();
        participant.setConversation(this);
        participant.setUser(user);
        participants.add(participant);
    }
    
    // Helper method to add a message
    public void addMessage(Message message) {
        message.setConversation(this);
        messages.add(message);
        
        // Update last message info
        this.lastMessage = message.getText();
        this.lastSenderId = message.getSender().getId();
        this.lastUpdated = LocalDateTime.now();
    }
}