package edu.cit.commudev.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security configuration for the application.
 * Configures authentication, authorization, CORS, and security filters.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Constructor for SecurityConfiguration.
     *
     * @param jwtAuthenticationFilter JWT filter for authentication
     * @param authenticationProvider provider for authentication
     */
    public SecurityConfiguration(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Configures the security filter chain.
     *
     * @param http HttpSecurity to configure
     * @return configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
        // Public endpoints
        .requestMatchers("/auth/**", "/public/**", "/error").permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        
        // Add these lines for public image access
        .requestMatchers("/profile-pictures/**", "/cover-photos/**").permitAll()
        .requestMatchers("/profile-pictures/**", "/cover-photos/**", "/messages/**").permitAll()
        // Public newsfeed endpoints
        .requestMatchers(HttpMethod.GET, "/api/newsfeed/all", "/api/newsfeed/{id}").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/newsfeed/user/**").permitAll()
        
        // Public comment endpoints
        .requestMatchers(HttpMethod.GET, "/api/comments/post/**", "/api/comments/count/**").permitAll()
        
        // Public ResourceHub endpoints
        .requestMatchers(HttpMethod.GET, "/api/resourcehub/all", "/api/resourcehub/{id}").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/resourcehub/category/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/resourcehub/search").permitAll()
        
        // Add this line for public profile access
        .requestMatchers("/users/profiles/**").permitAll()
        
        // Public user list
        .requestMatchers("/users/all").permitAll()

        
                        // Admin endpoints
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // User management endpoints
                        .requestMatchers("/users/").hasAnyRole("ADMIN", "MANAGER")

                        // User profile endpoints - authenticated users can access their own profile
                        .requestMatchers("/users/me/**").authenticated()
                        
                        // Authenticated newsfeed endpoints
                        .requestMatchers("/api/newsfeed/create").authenticated()
                        .requestMatchers("/api/newsfeed/my-posts").authenticated()
                        .requestMatchers("/api/newsfeed/update/**").authenticated()
                        .requestMatchers("/api/newsfeed/delete/**").authenticated()
                        .requestMatchers("/api/newsfeed/like/**").authenticated()
                        .requestMatchers("/api/newsfeed/can-edit/**").authenticated()
                        
                        // Authenticated comment endpoints
                        .requestMatchers(HttpMethod.POST, "/api/comments").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/comments/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/comments/**").authenticated()
                        .requestMatchers("/api/comments/my-comments").authenticated()
                        
                        // Authenticated ResourceHub endpoints (write operations)
                        .requestMatchers(HttpMethod.POST, "/api/resourcehub/create").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/resourcehub/update/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/resourcehub/delete/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/resourcehub/heart/**").authenticated()
                        .requestMatchers("/api/resourcehub/creator/**").authenticated()

                        // All other requests need authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configures CORS for the application.
     *
     * @return configured CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",  // Frontend development
                "http://localhost:3000",  // Alternative frontend port
                "http://localhost:8080"  // Backend URL
                
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin"
        ));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}