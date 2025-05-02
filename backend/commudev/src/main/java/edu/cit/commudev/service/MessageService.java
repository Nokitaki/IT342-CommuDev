package edu.cit.commudev.service;

import edu.cit.commudev.dto.ConversationDto;
import edu.cit.commudev.dto.MessageDto;
import edu.cit.commudev.entity.Conversation;
import edu.cit.commudev.entity.ConversationParticipant;
import edu.cit.commudev.entity.Message;
import edu.cit.commudev.entity.TypingStatus;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.ConversationParticipantRepository;
import edu.cit.commudev.repository.ConversationRepository;
import edu.cit.commudev.repository.MessageRepository;
import edu.cit.commudev.repository.TypingStatusRepository;
import edu.cit.commudev.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final TypingStatusRepository typingStatusRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageService(
            ConversationRepository conversationRepository,
            ConversationParticipantRepository participantRepository,
            MessageRepository messageRepository,
            TypingStatusRepository typingStatusRepository,
            UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
        this.messageRepository = messageRepository;
        this.typingStatusRepository = typingStatusRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get all conversations for a user
     */
    @Transactional(readOnly = true)
    public List<ConversationDto> getUserConversations(Long userId) {
        List<Conversation> conversations = conversationRepository.findByParticipantId(userId);
        
        return conversations.stream()
                .map(conversation -> {
                    // Find the other participant (for 1-1 conversations)
                    ConversationParticipant otherParticipant = conversation.getParticipants().stream()
                            .filter(p -> !p.getUser().getId().equals(userId))
                            .findFirst()
                            .orElse(null);
                    
                    ConversationDto dto = new ConversationDto();
                    dto.setId(conversation.getId());
                    dto.setLastMessage(conversation.getLastMessage());
                    dto.setLastSenderId(conversation.getLastSenderId());
                    dto.setLastUpdated(conversation.getLastUpdated());
                    dto.setCreatedAt(conversation.getCreatedAt());
                    
                    // Set other user info
                    if (otherParticipant != null) {
                        User otherUser = otherParticipant.getUser();
                        dto.setOtherUserId(otherUser.getId());
                        
                        // Format name based on available fields
                        String otherUserName = "";
                        if (otherUser.getFirstname() != null && otherUser.getLastname() != null) {
                            otherUserName = otherUser.getFirstname() + " " + otherUser.getLastname();
                        } else if (otherUser.getFirstname() != null) {
                            otherUserName = otherUser.getFirstname();
                        } else {
                            otherUserName = otherUser.getUsername();
                        }
                        
                        dto.setOtherUserName(otherUserName);
                        dto.setOtherUserAvatar(otherUser.getProfilePicture());
                        dto.setOtherUsername(otherUser.getUsername());
                    }
                    
                    // Get unread count
                    int unreadCount = messageRepository.countUnreadMessages(conversation.getId(), userId);
                    dto.setUnreadCount(unreadCount);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get or create a conversation between two users
     */
    @Transactional
    public ConversationDto getOrCreateConversation(Long userId1, Long userId2) {
        // Check if a conversation already exists
        Optional<Conversation> existingConversation = 
                conversationRepository.findConversationBetweenUsers(userId1, userId2);
        
        Conversation conversation;
        
        if (existingConversation.isPresent()) {
            conversation = existingConversation.get();
        } else {
            // Create a new conversation
            conversation = new Conversation();
            
            // Get user objects
            User user1 = userRepository.findById(userId1)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId1));
            
            User user2 = userRepository.findById(userId2)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId2));
            
            // Add participants
            conversation.addParticipant(user1);
            conversation.addParticipant(user2);
            
            // Save the conversation
            conversation = conversationRepository.save(conversation);
        }
        
        // Convert to DTO
        ConversationDto dto = new ConversationDto();
        dto.setId(conversation.getId());
        dto.setLastMessage(conversation.getLastMessage());
        dto.setLastSenderId(conversation.getLastSenderId());
        dto.setLastUpdated(conversation.getLastUpdated());
        dto.setCreatedAt(conversation.getCreatedAt());
        
        // Set other user info
        User otherUser = null;
        for (ConversationParticipant participant : conversation.getParticipants()) {
            if (!participant.getUser().getId().equals(userId1)) {
                otherUser = participant.getUser();
                break;
            }
        }
        
        if (otherUser != null) {
            dto.setOtherUserId(otherUser.getId());
            
            // Format name based on available fields
            String otherUserName = "";
            if (otherUser.getFirstname() != null && otherUser.getLastname() != null) {
                otherUserName = otherUser.getFirstname() + " " + otherUser.getLastname();
            } else if (otherUser.getFirstname() != null) {
                otherUserName = otherUser.getFirstname();
            } else {
                otherUserName = otherUser.getUsername();
            }
            
            dto.setOtherUserName(otherUserName);
            dto.setOtherUserAvatar(otherUser.getProfilePicture());
            dto.setOtherUsername(otherUser.getUsername());
        }
        
        // Get unread count
        int unreadCount = messageRepository.countUnreadMessages(conversation.getId(), userId1);
        dto.setUnreadCount(unreadCount);
        
        return dto;
    }

    /**
     * Get messages for a conversation
     */
    @Transactional(readOnly = true)
    public List<MessageDto> getConversationMessages(Long conversationId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        
        return messages.stream()
                .map(message -> {
                    MessageDto dto = new MessageDto();
                    dto.setId(message.getId());
                    dto.setConversationId(conversationId);
                    dto.setSenderId(message.getSender().getId());
                    
                    // Format sender name
                    User sender = message.getSender();
                    String senderName = "";
                    if (sender.getFirstname() != null && sender.getLastname() != null) {
                        senderName = sender.getFirstname() + " " + sender.getLastname();
                    } else if (sender.getFirstname() != null) {
                        senderName = sender.getFirstname();
                    } else {
                        senderName = sender.getUsername();
                    }
                    
                    dto.setSenderName(senderName);
                    dto.setSenderUsername(sender.getUsername());
                    dto.setSenderAvatar(sender.getProfilePicture());
                    dto.setText(message.getText());
                    dto.setRead(message.isRead());
                    dto.setEdited(message.isEdited());
                    dto.setTimestamp(message.getTimestamp());
                    dto.setEditedAt(message.getEditedAt());
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Send a message in a conversation
     */
    @Transactional
    public MessageDto sendMessage(Long conversationId, MessageDto messageDto) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        
        User sender = userRepository.findById(messageDto.getSenderId())
                .orElseThrow(() -> new RuntimeException("User not found: " + messageDto.getSenderId()));
        
        // Create and save the message
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setText(messageDto.getText());
        
        // Update conversation's last message info
        conversation.setLastMessage(messageDto.getText());
        conversation.setLastSenderId(sender.getId());
        conversation.setLastUpdated(LocalDateTime.now());
        
        // Save both
        conversationRepository.save(conversation);
        message = messageRepository.save(message);
        
        // Convert back to DTO
        MessageDto resultDto = new MessageDto();
        resultDto.setId(message.getId());
        resultDto.setConversationId(conversationId);
        resultDto.setSenderId(sender.getId());
        
        // Format sender name
        String senderName = "";
        if (sender.getFirstname() != null && sender.getLastname() != null) {
            senderName = sender.getFirstname() + " " + sender.getLastname();
        } else if (sender.getFirstname() != null) {
            senderName = sender.getFirstname();
        } else {
            senderName = sender.getUsername();
        }
        
        resultDto.setSenderName(senderName);
        resultDto.setSenderUsername(sender.getUsername());
        resultDto.setSenderAvatar(sender.getProfilePicture());
        resultDto.setText(message.getText());
        resultDto.setRead(message.isRead());
        resultDto.setEdited(message.isEdited());
        resultDto.setTimestamp(message.getTimestamp());
        
        return resultDto;
    }

    /**
     * Mark messages as read
     */
    @Transactional
    public void markMessagesAsRead(Long conversationId, Long userId) {
        // Find all unread messages in this conversation not sent by current user
        List<Message> unreadMessages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId)
                .stream()
                .filter(m -> !m.isRead() && !m.getSender().getId().equals(userId))
                .collect(Collectors.toList());
        
        // Mark them as read
        for (Message message : unreadMessages) {
            message.setRead(true);
        }
        
        messageRepository.saveAll(unreadMessages);
    }

    /**
     * Update a message
     */
    @Transactional
    public MessageDto updateMessage(Long messageId, String newText) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
        
        // Update the message
        message.setText(newText);
        message.setEdited(true);
        message.setEditedAt(LocalDateTime.now());
        
        // If this is the last message in the conversation, update that too
        Conversation conversation = message.getConversation();
        if (conversation.getLastMessage() != null && 
            conversation.getLastSenderId() != null &&
            conversation.getLastSenderId().equals(message.getSender().getId())) {
            
            conversation.setLastMessage(newText);
            conversationRepository.save(conversation);
        }
        
        message = messageRepository.save(message);
        
        // Convert to DTO
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setConversationId(message.getConversation().getId());
        dto.setSenderId(message.getSender().getId());
        
        // Format sender name
        User sender = message.getSender();
        String senderName = "";
        if (sender.getFirstname() != null && sender.getLastname() != null) {
            senderName = sender.getFirstname() + " " + sender.getLastname();
        } else if (sender.getFirstname() != null) {
            senderName = sender.getFirstname();
        } else {
            senderName = sender.getUsername();
        }
        
        dto.setSenderName(senderName);
        dto.setSenderUsername(sender.getUsername());
        dto.setSenderAvatar(sender.getProfilePicture());
        dto.setText(message.getText());
        dto.setRead(message.isRead());
        dto.setEdited(message.isEdited());
        dto.setTimestamp(message.getTimestamp());
        dto.setEditedAt(message.getEditedAt());
        
        return dto;
    }

    /**
     * Delete a message
     */
    @Transactional
    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
        
        // Check if this is the last message in the conversation
        Conversation conversation = message.getConversation();
        boolean isLastMessage = false;
        
        if (conversation.getLastMessage() != null && 
            conversation.getLastSenderId() != null &&
            conversation.getLastSenderId().equals(message.getSender().getId())) {
            
            isLastMessage = true;
        }
        
        // Delete the message
        messageRepository.delete(message);
        
        // If this was the last message, update the conversation's last message info
        if (isLastMessage) {
            // Find the new last message
            List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversation.getId());
            
            if (!messages.isEmpty()) {
                // Get the most recent message
                Message lastMessage = messages.get(messages.size() - 1);
                conversation.setLastMessage(lastMessage.getText());
                conversation.setLastSenderId(lastMessage.getSender().getId());
            } else {
                // No messages left
                conversation.setLastMessage(null);
                conversation.setLastSenderId(null);
            }
            
            conversation.setLastUpdated(LocalDateTime.now());
            conversationRepository.save(conversation);
        }
    }

    /**
     * Get typing users for a conversation
     */
    @Transactional(readOnly = true)
    public List<Long> getTypingUsers(Long conversationId) {
        List<TypingStatus> typingStatuses = typingStatusRepository.findByConversationIdAndTypingTrue(conversationId);
        
        // Filter out stale typing indicators (older than 5 seconds)
        LocalDateTime cutoff = LocalDateTime.now().minusSeconds(5);
        
        return typingStatuses.stream()
                .filter(status -> status.getTimestamp().isAfter(cutoff))
                .map(status -> status.getUser().getId())
                .collect(Collectors.toList());
    }

    /**
     * Update typing status
     */
    @Transactional
    public void updateTypingStatus(Long conversationId, Long userId, Boolean isTyping) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        // Find existing status or create a new one
        Optional<TypingStatus> existingStatus = typingStatusRepository.findByConversationIdAndUserId(conversationId, userId);
        
        TypingStatus status;
        if (existingStatus.isPresent()) {
            status = existingStatus.get();
        } else {
            status = new TypingStatus();
            status.setConversation(conversation);
            status.setUser(user);
        }
        
        // Update status
        status.setTyping(isTyping);
        status.setTimestamp(LocalDateTime.now());
        
        typingStatusRepository.save(status);
    }

    /**
     * Delete a conversation and all its messages
     */
    @Transactional
public void deleteConversation(Long conversationId) {
    Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
    
    // First, delete all typing statuses associated with the conversation
    List<TypingStatus> typingStatuses = typingStatusRepository.findByConversationId(conversationId);
    typingStatusRepository.deleteAll(typingStatuses);
    
    // Then, delete the conversation (cascade will handle messages and participants)
    conversationRepository.delete(conversation);
}

    /**
     * Check if a user has access to a conversation
     */
    @Transactional(readOnly = true)
    public boolean userHasAccessToConversation(Long userId, Long conversationId) {
        return participantRepository.existsByConversationIdAndUserId(conversationId, userId);
    }

    /**
     * Check if a user is the sender of a message
     */
    @Transactional(readOnly = true)
    public boolean isMessageSender(Long messageId, Long userId) {
        Optional<Message> message = messageRepository.findById(messageId);
        
        if (message.isPresent()) {
            return message.get().getSender().getId().equals(userId);
        }
        
        return false;
    }
}