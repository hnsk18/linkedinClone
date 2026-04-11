package com.linkup.backend.service;

import com.linkup.backend.model.User;
import com.linkup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class UserService {

    public record LoginResult(User user, String errorMessage) {
        public boolean ok() {
            return user != null;
        }
    }

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

        String plain = user.getPassword() == null ? "" : user.getPassword().trim();
        if (plain.isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        user.setPassword(passwordEncoder.encode(plain));

        return userRepository.save(user);
    }

    /**
     * Login: {@code identifier} is email (any case) or username.
     * Returns a clear error message for debugging (not for production hardening).
     */
    public LoginResult attemptLogin(String emailOrUsername, String password) {

        if (emailOrUsername == null || password == null) {
            return new LoginResult(null, "Email and password are required.");
        }

        String id = emailOrUsername.trim();
        String rawPassword = password.trim();
        if (id.isEmpty() || rawPassword.isEmpty()) {
            return new LoginResult(null, "Email and password are required.");
        }

        User user = userRepository.findByEmailIgnoreCase(id.toLowerCase());
        if (user == null) {
            user = userRepository.findByUsernameIgnoreCase(id).orElse(null);
        }

        if (user == null) {
            return new LoginResult(null,
                    "No account found for that email or username. Register first or check spelling.");
        }

        String stored = user.getPassword();
        if (stored == null || stored.isBlank()) {
            return new LoginResult(null, "This account has no password set. Register again or reset in the database.");
        }
        stored = stored.trim();

        boolean looksBcrypt = stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");
        if (looksBcrypt) {
            if (!passwordEncoder.matches(rawPassword, stored)) {
                return new LoginResult(null,
                        "Wrong password. Use the password you chose at sign-up (not the long hash from the database).");
            }
        } else {
            if (!stored.equals(rawPassword)) {
                return new LoginResult(null, "Wrong password.");
            }
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        }

        return new LoginResult(user, null);
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