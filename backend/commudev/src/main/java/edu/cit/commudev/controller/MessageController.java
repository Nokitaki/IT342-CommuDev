package edu.cit.commudev.controller;

import edu.cit.commudev.dto.ConversationDto;
import edu.cit.commudev.dto.MessageDto;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:5173", "https://it-342-commu-dev.vercel.app"})
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * Get all conversations for the current user
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getUserConversations(@AuthenticationPrincipal User user) {
        List<ConversationDto> conversations = messageService.getUserConversations(user.getId());
        return ResponseEntity.ok(conversations);
    }

    /**
     * Get or create a conversation with another user
     */
    @PostMapping("/conversations")
    public ResponseEntity<ConversationDto> getOrCreateConversation(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Long> request) {
        
        Long otherUserId = request.get("userId");
        ConversationDto conversation = messageService.getOrCreateConversation(user.getId(), otherUserId);
        return ResponseEntity.ok(conversation);
    }

    /**
     * Get messages for a specific conversation
     */
    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<List<MessageDto>> getConversationMessages(
            @AuthenticationPrincipal User user,
            @PathVariable Long conversationId) {
        
        // Check if user has access to this conversation
        if (!messageService.userHasAccessToConversation(user.getId(), conversationId)) {
            return ResponseEntity.status(403).build();
        }
        
        List<MessageDto> messages = messageService.getConversationMessages(conversationId);
        
        // Mark messages as read
        messageService.markMessagesAsRead(conversationId, user.getId());
        
        return ResponseEntity.ok(messages);
    }

    /**
     * Send a message in a conversation
     */
    @PostMapping("/conversations/{conversationId}")
    public ResponseEntity<MessageDto> sendMessage(
            @AuthenticationPrincipal User user,
            @PathVariable Long conversationId,
            @RequestBody MessageDto messageDto) {
        
        // Check if user has access to this conversation
        if (!messageService.userHasAccessToConversation(user.getId(), conversationId)) {
            return ResponseEntity.status(403).build();
        }
        
        // Set the sender ID from authenticated user
        messageDto.setSenderId(user.getId());
        
        MessageDto sent = messageService.sendMessage(conversationId, messageDto);
        return ResponseEntity.ok(sent);
    }

    /**
     * Update a message (edit text)
     */
    @PutMapping("/messages/{messageId}")
    public ResponseEntity<MessageDto> updateMessage(
            @AuthenticationPrincipal User user,
            @PathVariable Long messageId,
            @RequestBody Map<String, String> update) {
        
        String newText = update.get("text");
        
        // Check if user is the message sender
        if (!messageService.isMessageSender(messageId, user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        MessageDto updated = messageService.updateMessage(messageId, newText);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a message
     */
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @AuthenticationPrincipal User user,
            @PathVariable Long messageId) {
        
        // Check if user is the message sender
        if (!messageService.isMessageSender(messageId, user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * Get typing status for a conversation
     */
    @GetMapping("/conversations/{conversationId}/typing")
    public ResponseEntity<List<Long>> getTypingUsers(
            @AuthenticationPrincipal User user,
            @PathVariable Long conversationId) {
        
        // Check if user has access to this conversation
        if (!messageService.userHasAccessToConversation(user.getId(), conversationId)) {
            return ResponseEntity.status(403).build();
        }
        
        List<Long> typingUsers = messageService.getTypingUsers(conversationId);
        return ResponseEntity.ok(typingUsers);
    }

    /**
     * Update typing status
     */
    @PostMapping("/conversations/{conversationId}/typing")
    public ResponseEntity<?> updateTypingStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long conversationId,
            @RequestBody Map<String, Boolean> status) {
        
        Boolean isTyping = status.get("isTyping");
        
        // Check if user has access to this conversation
        if (!messageService.userHasAccessToConversation(user.getId(), conversationId)) {
            return ResponseEntity.status(403).build();
        }
        
        messageService.updateTypingStatus(conversationId, user.getId(), isTyping);
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * Delete a conversation
     */
    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<?> deleteConversation(
            @AuthenticationPrincipal User user,
            @PathVariable Long conversationId) {
        
        // Check if user has access to this conversation
        if (!messageService.userHasAccessToConversation(user.getId(), conversationId)) {
            return ResponseEntity.status(403).build();
        }
        
        messageService.deleteConversation(conversationId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}