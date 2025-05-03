// Create this in a file like src/main/java/edu/cit/commudev/config/DatabaseConfig.java
package edu.cit.commudev.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import javax.sql.DataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;

@Configuration
public class DatabaseConfig {

    @Value("${DB_URL}")
    private String dbUrl;
    
    @Value("${DB_USERNAME}")
    private String dbUsername;
    
    @Value("${DB_PASSWORD}")
    private String dbPassword;
    
    @Bean
    public DataSource getDataSource() {
        return DataSourceBuilder.create()
                .url(dbUrl)
                .username(dbUsername)
                .password(dbPassword)
                .build();
    }
}