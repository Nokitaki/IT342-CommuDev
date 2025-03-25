package edu.cit.commudev.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;
    
    @Column(name = "username", unique = true, nullable = false)
    private String username;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "firstname")
    private String firstname;
    
    @Column(name = "middleinit")
    private String middleinit;
    
    @Column(name = "lastname")
    private String lastname;
    
    @Column(name = "date_of_birth")
    private String dateOfBirth;
    
    @Column(name = "age")
    private int age;
    
    @Column(name = "state")
    private String state;
    
    @Column(name = "employment_status")
    private String employmentStatus;
    
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @Column(name = "profile_picture")
    private String profilePicture;
    
    @Column(name = "biography", columnDefinition = "TEXT")
    private String biography;
    
    // Default constructor
    public UserEntity() {
    }
    
    // Constructor with essential fields
    public UserEntity(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
    
    // Full constructor
    public UserEntity(String username, String password, String firstname, String middleinit, 
                     String lastname, String dateOfBirth, int age, String state, 
                     String employmentStatus, String email, String profilePicture, String biography) {
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.middleinit = middleinit;
        this.lastname = lastname;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
        this.state = state;
        this.employmentStatus = employmentStatus;
        this.email = email;
        this.profilePicture = profilePicture;
        this.biography = biography;
    }
    
    // Getters and Setters
    public int getUserId() {
        return userId;
    }
    
    public void setUserId(int userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getFirstname() {
        return firstname;
    }
    
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }
    
    public String getMiddleinit() {
        return middleinit;
    }
    
    public void setMiddleinit(String middleinit) {
        this.middleinit = middleinit;
    }
    
    public String getLastname() {
        return lastname;
    }
    
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
    
    public String getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getEmploymentStatus() {
        return employmentStatus;
    }
    
    public void setEmploymentStatus(String employmentStatus) {
        this.employmentStatus = employmentStatus;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getProfilePicture() {
        return profilePicture;
    }
    
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
    
    public String getBiography() {
        return biography;
    }
    
    public void setBiography(String biography) {
        this.biography = biography;
    }
}