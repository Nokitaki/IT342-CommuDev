package edu.cit.commudev.config;

import edu.cit.commudev.entity.Role;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.RoleRepository;
import edu.cit.commudev.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Optional;

/**
 * Initializes application data when the application starts.
 */
@Configuration
public class DataInitializer {

    /**
     * Initialize roles and admin user for development and production environments.
     * In production, admin user is only created if specified in environment variables.
     */
    @Bean
    @Profile({"dev", "prod"})
    public CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            Environment env) {

        return args -> {
            // Create roles if they don't exist
            createRoleIfNotFound(roleRepository, "USER");
            createRoleIfNotFound(roleRepository, "MANAGER");
            createRoleIfNotFound(roleRepository, "ADMIN");

            // For production, only create admin if specified in environment
            if (Arrays.asList(env.getActiveProfiles()).contains("dev") ||
                    "true".equals(env.getProperty("app.create-admin"))) {

                String adminUsername = env.getProperty("app.admin.username", "admin");
                String adminEmail = env.getProperty("app.admin.email", "admin@example.com");
                String adminPassword = env.getProperty("app.admin.password", "adminPassword123");

                // Check if admin already exists
                Optional<User> existingAdmin = userRepository.findByUsername(adminUsername);
                if (existingAdmin.isEmpty()) {
                    // Create admin user
                    User adminUser = new User();
                    adminUser.setUsername(adminUsername);
                    adminUser.setEmail(adminEmail);
                    adminUser.setPassword(passwordEncoder.encode(adminPassword));
                    adminUser.setEnabled(true);

                    // Assign admin role
                    Role adminRole = roleRepository.findByName("ADMIN")
                            .orElseThrow(() -> new RuntimeException("Admin role not found"));
                    adminUser.addRole(adminRole);

                    userRepository.save(adminUser);

                    System.out.println("Created admin user: " + adminUsername);
                }
            }
        };
    }

    /**
     * Creates a role if it doesn't already exist.
     *
     * @param roleRepository the role repository
     * @param name the role name
     */
    private void createRoleIfNotFound(RoleRepository roleRepository, String name) {
        Optional<Role> existingRole = roleRepository.findByName(name);
        if (existingRole.isEmpty()) {
            Role role = new Role(name);
            roleRepository.save(role);
            System.out.println("Created role: " + name);
        }
    }
}