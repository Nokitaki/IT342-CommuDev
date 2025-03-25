package edu.cit.commudev.Dto;

public class UserResponseDTO {
    
    private int userId;
    private String username;
    private String firstname;
    private String middleinit;
    private String lastname;
    private String dateOfBirth;
    private int age;
    private String state;
    private String employmentStatus;
    private String email;
    private String profilePicture;
    private String biography;
    
    // Default constructor
    public UserResponseDTO() {
    }
    
    // Constructor with fields
    public UserResponseDTO(int userId, String username, String firstname, String middleinit, 
                          String lastname, String dateOfBirth, int age, String state, 
                          String employmentStatus, String email, String profilePicture, String biography) {
        this.userId = userId;
        this.username = username;
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