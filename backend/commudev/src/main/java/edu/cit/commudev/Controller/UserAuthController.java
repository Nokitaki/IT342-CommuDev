package edu.cit.commudev.Controller;

import edu.cit.commudev.Entity.UserAuthEntity;
import edu.cit.commudev.Entity.UserEntity;
import edu.cit.commudev.Service.UserAuthService;
import edu.cit.commudev.Service.UserService;
import edu.cit.commudev.Util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserAuthController {

    @Autowired
    private UserAuthService userAuthService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

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
            // Authenticate with Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            
            // Generate JWT token
            String token = jwtTokenUtil.generateToken(username);
            
            // Get user details for response
            UserEntity user = userService.getUserByUsername(username);
            
            // Return response with token and user info
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("userId", user.getUserId());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(
                Map.of("error", "Invalid credentials"), 
                HttpStatus.UNAUTHORIZED
            );
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
        String password = authDetails.get("password");
        String email = authDetails.get("email");
        
        if (username == null || password == null || email == null) {
            return new ResponseEntity<>(
                Map.of("error", "Username, password, and email are required"), 
                HttpStatus.BAD_REQUEST
            );
        }
        
        try {
            // Create user with encoded password
            UserEntity userEntity = new UserEntity();
            userEntity.setUsername(username);
            userEntity.setPassword(passwordEncoder.encode(password));
            userEntity.setEmail(email);
            
            // Save user to database
            UserEntity savedUser = userService.createUser(userEntity);
            
            // Register user auth entry
            UserAuthEntity userAuth = userAuthService.registerUserAuth(username);
            
            // Generate token for immediate login
            String token = jwtTokenUtil.generateToken(username);
            
            // Return response with token and user info
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("userId", savedUser.getUserId());
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.BAD_REQUEST
            );
        }
    }
    
    // Validate token endpoint
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> tokenMap) {
        String token = tokenMap.get("token");
        
        if (token == null) {
            return new ResponseEntity<>(
                Map.of("valid", false), 
                HttpStatus.BAD_REQUEST
            );
        }
        
        boolean isValid = jwtTokenUtil.validateToken(token);
        
        if (isValid) {
            String username = jwtTokenUtil.extractUsername(token);
            return new ResponseEntity<>(
                Map.of("valid", true, "username", username), 
                HttpStatus.OK
            );
        } else {
            return new ResponseEntity<>(
                Map.of("valid", false), 
                HttpStatus.UNAUTHORIZED
            );
        }
    }
    
    // Logout endpoint (for demonstration - in JWT, logout is typically handled client-side)
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // In JWT authentication, you typically don't need to do anything server-side for logout
        // The client just removes the JWT token from storage (localStorage/sessionStorage)
        return new ResponseEntity<>(
            Map.of("message", "Logged out successfully"), 
            HttpStatus.OK
        );
    }
}