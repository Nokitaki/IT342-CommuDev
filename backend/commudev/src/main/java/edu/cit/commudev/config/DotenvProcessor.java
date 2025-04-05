package edu.cit.commudev.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.Properties;

public class DotenvProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Resource resource = new FileSystemResource(".env");
        
        if (resource.exists()) {
            Properties props = new Properties();
            try {
                props.load(resource.getInputStream());
                environment.getPropertySources().addFirst(new PropertiesPropertySource("dotenv", props));
            } catch (IOException e) {
                // Handle exception
            }
        }
    }
}