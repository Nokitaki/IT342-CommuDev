package edu.cit.commudev.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String firstname;
    private String lastname;
    private String dateOfBirth;
    private Integer age;
    private String country;
    private String employmentStatus;
    private String profilePicture;
    private String biography;
    private boolean enabled;
    private List<String> roles;
    private LocalDateTime createdAt;
    private String profileVisibility;

    // Basic constructor for simple responses
    public UserDto(Long id, String username, String email, boolean enabled) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.enabled = enabled;
    }
}