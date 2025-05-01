package edu.cit.commudev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypingStatusDto {
    private Long userId;
    private boolean isTyping;
}