package edu.cit.commudev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String senderUsername;
    private String senderAvatar;
    private String text;
    private boolean read;
    private boolean edited;
    private LocalDateTime timestamp;
    private LocalDateTime editedAt;
}