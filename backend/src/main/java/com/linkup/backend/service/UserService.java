package com.linkup.backend.service;

import com.linkup.backend.model.User;
import com.linkup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // REGISTER
    public User registerUser(User user){

        if(user.getName() == null || user.getName().isBlank()){
            throw new RuntimeException("Name is required");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        String normalizedEmail = user.getEmail().trim().toLowerCase();
        user.setEmail(normalizedEmail);

        if(userRepository.findByEmailIgnoreCase(normalizedEmail) != null){
            throw new RuntimeException("Email already exists");
        }

        if (user.getUsername() == null || user.getUsername().isBlank()) {
            String base = user.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");
            user.setUsername(base + "-" + UUID.randomUUID().toString().substring(0, 6));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // LOGIN
    public User login(String email, String password){

        if (email == null || password == null) {
            return null;
        }

        String normalizedEmail = email.trim().toLowerCase();
        String rawPassword = password;

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail);

        if(user == null){
            return null;
        }

        String stored = user.getPassword();
        if (stored == null) {
            return null;
        }

        boolean looksBcrypt = stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");
        if (looksBcrypt) {
            if (!passwordEncoder.matches(rawPassword, stored)) {
                return null;
            }
        } else {
            // Backward-compatible login for older plaintext-stored passwords.
            // If it matches, upgrade it to bcrypt.
            if (!stored.equals(rawPassword)) {
                return null;
            }
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        }

        return user;
    }

    public User updateIntro(Long userId, User patch) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (patch.getName() != null) user.setName(patch.getName());
        if (patch.getHeadline() != null) user.setHeadline(patch.getHeadline());
        if (patch.getLocation() != null) user.setLocation(patch.getLocation());
        if (patch.getAbout() != null) user.setAbout(patch.getAbout());
        if (patch.getCollege() != null) user.setCollege(patch.getCollege());
        if (patch.getProfilePicture() != null) user.setProfilePicture(patch.getProfilePicture());
        if (patch.getCoverPicture() != null) user.setCoverPicture(patch.getCoverPicture());
        if (patch.getConnectionsCount() != null) user.setConnectionsCount(patch.getConnectionsCount());

        return userRepository.save(user);
    }
}