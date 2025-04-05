package edu.cit.commudev.service;

import edu.cit.commudev.dto.LoginUserDto;
import edu.cit.commudev.dto.RegisterUserDto;
import edu.cit.commudev.dto.VerifyUserDto;
import edu.cit.commudev.entity.Role;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.RoleRepository;
import edu.cit.commudev.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class AuthenticationService {
    private static final Logger logger = Logger.getLogger(AuthenticationService.class.getName());

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthenticationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Transactional
    public User signup(RegisterUserDto input) {
        logger.info("Starting signup process for: " + input.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(input.getEmail())) {
            logger.warning("Email already exists: " + input.getEmail());
            throw new IllegalArgumentException("Email already in use");
        }

        if (userRepository.existsByUsername(input.getUsername())) {
            logger.warning("Username already exists: " + input.getUsername());
            throw new IllegalArgumentException("Username already in use");
        }

        // Find or create default role first, outside user creation
        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> {
                    logger.info("Creating new USER role");
                    Role newRole = new Role("USER");
                    return roleRepository.save(newRole);
                });

        // Create user
        User user = new User(
                input.getUsername(),
                input.getEmail(),
                passwordEncoder.encode(input.getPassword())
        );

        // Generate verification code
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(24));

        // Add role to user before saving
        user.addRole(userRole);

        // Save user with role
        User savedUser = userRepository.save(user);
        logger.info("User saved with ID: " + savedUser.getId());

        // After successful save, send email
        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), "Account Verification",
                    "Your verification code is: " + verificationCode);
            logger.info("Verification email sent successfully to: " + savedUser.getEmail());
        } catch (MessagingException e) {
            logger.log(Level.WARNING, "Failed to send verification email", e);
            // Don't throw exception here, just log it
        }

        return savedUser;
    }

    public User authenticate(LoginUserDto input) {
        logger.info("Authenticating user: " + input.getEmail());

        // Try to find user by email first, then by username
        User user = userRepository.findByEmail(input.getEmail())
                .orElseGet(() -> userRepository.findByUsername(input.getEmail())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        // Check verification
        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }

        // Authenticate
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), input.getPassword())
        );

        logger.info("Authentication successful for user: " + user.getUsername());
        return user;
    }

    @Transactional
    public void verifyUser(VerifyUserDto input) {
        logger.info("Verifying user with email: " + input.getEmail());

        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }

        if (user.getVerificationCode().equals(input.getVerificationCode())) {
            user.setEnabled(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
            userRepository.save(user);
            logger.info("User verified successfully: " + user.getEmail());
        } else {
            logger.warning("Invalid verification code for user: " + user.getEmail());
            throw new RuntimeException("Invalid verification code");
        }
    }

    @Transactional
    public void resendVerificationCode(String email) {
        logger.info("Resending verification code to: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            throw new RuntimeException("Account is already verified");
        }

        // Generate new code
        String newCode = generateVerificationCode();
        user.setVerificationCode(newCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        // Send email
        try {
            emailService.sendVerificationEmail(email, "Account Verification",
                    "Your new verification code is: " + newCode);
            logger.info("New verification code sent to: " + email);
        } catch (MessagingException e) {
            logger.log(Level.SEVERE, "Failed to send verification email", e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        return String.valueOf(code);
    }
}