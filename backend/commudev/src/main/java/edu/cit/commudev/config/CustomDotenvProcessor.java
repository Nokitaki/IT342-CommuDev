package edu.cit.commudev.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public class CustomDotenvProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // Specify the exact path to your .env file
        Path envPath = Paths.get(".env");
        Resource resource = new FileSystemResource(envPath.toFile());
        
        System.out.println("Looking for .env file at: " + envPath.toAbsolutePath());
        
        if (resource.exists()) {
            System.out.println(".env file found!");
            Properties props = new Properties();
            try {
                props.load(resource.getInputStream());
                environment.getPropertySources().addFirst(new PropertiesPropertySource("dotenv", props));
                System.out.println("Loaded properties: " + props.keySet());
            } catch (IOException e) {
                System.err.println("Error loading .env file: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.err.println(".env file not found at: " + envPath.toAbsolutePath());
        }
    }
}