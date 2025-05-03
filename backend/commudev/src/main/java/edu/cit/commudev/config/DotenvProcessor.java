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

public class DotenvProcessor implements EnvironmentPostProcessor {

    @Override
public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
    // Specify the exact path to your .env file
    Path envPath = Paths.get(".env");
    Resource resource = new FileSystemResource(envPath.toFile());
    
    if (resource.exists()) {
        System.out.println(".env file found! Loading properties...");
        // Load .env file
        Properties props = new Properties();
        try {
            props.load(resource.getInputStream());
            environment.getPropertySources().addFirst(new PropertiesPropertySource("dotenv", props));
        } catch (IOException e) {
            System.err.println("Error loading .env file: " + e.getMessage());
        }
    } else {
        // This is normal in production - Railway uses environment variables
        System.out.println(".env file not found. Using environment variables instead.");
    }
}
}