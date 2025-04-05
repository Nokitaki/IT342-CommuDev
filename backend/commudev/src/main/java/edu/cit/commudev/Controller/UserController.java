package edu.cit.commudev.controller;

import edu.cit.commudev.dto.UserDto;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.UserRepository;
import edu.cit.commudev.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/")
    public ResponseEntity<List<UserDto>> allUsers() {
        List<User> users = userService.allUsers();
        List<UserDto> userDtos = users.stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.isEnabled()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/me")
    public ResponseEntity<?> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User is not authenticated");
        }

        String identifier = authentication.getName();
        System.out.println("Authenticated user identifier: " + identifier);

        // Try to find by email first
        Optional<User> userByEmail = userRepository.findByEmail(identifier);
        User currentUser;

        if (userByEmail.isPresent()) {
            currentUser = userByEmail.get();
            System.out.println("User found by email: " + identifier);
        } else {
            // Try to find by username
            Optional<User> userByUsername = userRepository.findByUsername(identifier);

            if (userByUsername.isPresent()) {
                currentUser = userByUsername.get();
                System.out.println("User found by username: " + identifier);
            } else {
                System.out.println("User not found with identifier: " + identifier);
                return ResponseEntity.status(404).body("User not found");
            }
        }

        // Create a DTO to avoid exposing sensitive data
        UserDto userDto = new UserDto(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                currentUser.isEnabled()
        );

        return ResponseEntity.ok(userDto);
    }
}