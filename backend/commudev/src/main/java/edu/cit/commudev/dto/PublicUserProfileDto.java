package edu.cit.commudev.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class PublicUserProfileDto {
    private String username;
    private String firstname;
    private String lastname;
    private String profilePicture;
    private String biography;
    private String country;
    private String profileVisibility;
    // You can add more fields that should be publicly visible
}