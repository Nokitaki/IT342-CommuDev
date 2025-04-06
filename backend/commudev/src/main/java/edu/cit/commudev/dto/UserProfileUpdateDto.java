package edu.cit.commudev.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class UserProfileUpdateDto {
    private String firstname;
    private String lastname;
    private String dateOfBirth;
    private Integer age;
    private String country;
    private String employmentStatus;
    private String biography;
    private String profileVisibility;
}