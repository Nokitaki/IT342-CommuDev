package edu.cit.commudev.controller;

import edu.cit.commudev.dto.LoginUserDto;
import edu.cit.commudev.dto.RegisterUserDto;
import edu.cit.commudev.dto.VerifyUserDto;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.service.AuthenticationService;
import edu.cit.commudev.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private static final Logger logger = Logger.getLogger(AuthenticationController.class.getName());

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto) {
        try {
            logger.info("Processing signup request for: " + registerUserDto.getEmail());
            User registeredUser = authenticationService.signup(registerUserDto);

            // Create a safe response object without circular references
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful. Please check your email for verification code.");
            response.put("email", registeredUser.getEmail());
            response.put("username", registeredUser.getUsername());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the full exception for debugging
            logger.log(Level.SEVERE, "Error during signup process", e);

            // Return a clear error message to the client
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserDto loginUserDto) {
        try {
            // Check if the input is an email
            if (!loginUserDto.getEmail().contains("@")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Please use your email address to login"));
            }
    
            User authenticatedUser = authenticationService.authenticate(loginUserDto);
            String jwtToken = jwtService.generateToken(authenticatedUser);
    
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("expiresIn", jwtService.getExpirationTime());
    
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error during login process", e);
    
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok(Map.of("message", "Account verified successfully"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error during verification process", e);

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Verification failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok(Map.of("message", "Verification code sent"));
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error resending verification code", e);

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to resend code: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}