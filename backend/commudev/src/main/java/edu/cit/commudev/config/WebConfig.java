package edu.cit.commudev.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Register resource handler for profile pictures
        registry.addResourceHandler("/profile-pictures/**")
                .addResourceLocations("file:uploads/profile-pictures/");
                
        // Add this line for cover photos
        registry.addResourceHandler("/cover-photos/**")
                .addResourceLocations("file:uploads/cover-photos/");
                
        // Make sure this mapping exists and is correct for message images
        registry.addResourceHandler("/messages/**")
                .addResourceLocations("file:uploads/messages/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
            "http://localhost:5173", 
                       "http://localhost:3000",
                       "it-342-commu-dev-git-replica-kenji-nokitakis-projects.vercel.app" // Add your Vercel domain
        )           
                
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}