package edu.cit.commudev.Controller;

import edu.cit.commudev.Entity.UserAuthEntity;
import edu.cit.commudev.Service.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserAuthController {

    @Autowired
    private UserAuthService userAuthService;

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        if (username == null || password == null) {
            return new ResponseEntity<>(
                Map.of("error", "Username and password are required"), 
                HttpStatus.BAD_REQUEST
            );
        }
        
        try {
            boolean isValid = userAuthService.validateCredentials(username, password);
            
            if (isValid) {
                // In a real application, you would generate a JWT token or session here
                return new ResponseEntity<>(
                    Map.of(
                        "message", "Login successful",
                        "username", username
                    ), 
                    HttpStatus.OK
                );
            } else {
                return new ResponseEntity<>(
                    Map.of("error", "Invalid credentials"), 
                    HttpStatus.UNAUTHORIZED
                );
            }
        } catch (Exception e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.UNAUTHORIZED
            );
        }
    }
    
    // Get auth info by username
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getAuthByUsername(@PathVariable String username) {
        try {
            UserAuthEntity userAuth = userAuthService.getAuthByUsername(username);
            return new ResponseEntity<>(userAuth, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.NOT_FOUND
            );
        }
    }
    
    // Register auth entry (typically called internally, but exposed for demonstration)
    @PostMapping("/register")
    public ResponseEntity<?> registerAuth(@RequestBody Map<String, String> authDetails) {
        String username = authDetails.get("username");
        
        if (username == null) {
            return new ResponseEntity<>(
                Map.of("error", "Username is required"), 
                HttpStatus.BAD_REQUEST
            );
        }
        
        try {
            UserAuthEntity userAuth = userAuthService.registerUserAuth(username);
            return new ResponseEntity<>(userAuth, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.BAD_REQUEST
            );
        }
    }
    
    // Logout endpoint (for demonstration - in a real app this would handle tokens/sessions)
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // In a real application, you would invalidate the JWT token or session here
        return new ResponseEntity<>(
            Map.of("message", "Logged out successfully"), 
            HttpStatus.OK
        );
    }
}