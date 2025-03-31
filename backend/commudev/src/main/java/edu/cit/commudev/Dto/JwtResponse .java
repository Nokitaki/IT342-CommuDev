package main.java.edu.cit.commudev.Dto;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private int userId;
    private String username;
    
    public JwtResponse(String token, int userId, String username) {
        this.token = token;
        this.userId = userId;
        this.username = username;
    }
    
    // Getters and setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
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
    
    // Return the full token with type
    public String getAccessToken() {
        return this.type + " " + this.token;
    }
}