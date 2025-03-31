package edu.cit.commudev.Service;

import edu.cit.commudev.Entity.UserEntity;
import edu.cit.commudev.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        // In a real application, you would use roles/authorities from your database
        // For simplicity, we're just returning a User object with an empty list of authorities
        return new User(userEntity.getUsername(), userEntity.getPassword(), new ArrayList<>());
    }
}