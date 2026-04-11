package com.linkup.backend.controller;

import com.linkup.backend.model.User;
import com.linkup.backend.repository.UserRepository;
import com.linkup.backend.service.UserService;
import com.linkup.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.UUID;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000" })
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        UserService.LoginResult result = userService.attemptLogin(
                user != null ? user.getEmail() : null,
                user != null ? user.getPassword() : null);

        if (!result.ok()) {
            return ResponseEntity.status(401).body(result.errorMessage());
        }

        User loggedUser = result.user();
        String token = jwtUtil.generateToken(loggedUser.getEmail());

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(token);
    }

    // UPDATE INTRO (name/headline/location/about/etc.)
    @PutMapping("/{userId}/intro")
    public ResponseEntity<User> updateIntro(@PathVariable Long userId, @RequestBody User patch) {
        User updated = userService.updateIntro(userId, patch);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{userId}/photo")
    public ResponseEntity<?> uploadPhoto(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest request) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid token");
        }
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }

        final User user;
        try {
            String tokenEmail = jwtUtil.extractEmail(authHeader.substring(7)).trim().toLowerCase();
            User owner = userRepository.findById(userId).orElse(null);
            if (owner == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            if (owner.getEmail() == null || !owner.getEmail().trim().toLowerCase().equals(tokenEmail)) {
                return ResponseEntity.status(403).body("You can only update your own photos");
            }
            user = owner;
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        try {
            String dirPath = "uploads";
            File dir = new File(dirPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            String newFileName = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(dirPath, newFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/uploads/" + newFileName;
            
            if ("profile".equalsIgnoreCase(type)) {
                user.setProfilePicture(fileUrl);
            } else if ("cover".equalsIgnoreCase(type)) {
                user.setCoverPicture(fileUrl);
            } else {
                return ResponseEntity.badRequest().body("Invalid photo type. Use 'profile' or 'cover'.");
            }
            
            userRepository.save(user);
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Photo upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid token");
        }
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            if (email == null || email.isBlank()) {
                return ResponseEntity.status(401).body("Invalid token");
            }
            User user = userRepository.findByEmailIgnoreCase(email.trim());
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }

    /**
     * TEMP DEBUG ENDPOINT (remove before production).
     * Helps diagnose why login returns 401 without leaking passwords.
     */
    @RequestMapping(value = "/debug/check-email", method = { RequestMethod.GET, RequestMethod.POST })
    public ResponseEntity<?> debugCheckEmail(
            @RequestParam(value = "email", required = false) String email,
            @RequestBody(required = false) Map<String, Object> body) {
        if ((email == null || email.isBlank()) && body != null && body.get("email") != null) {
            email = String.valueOf(body.get("email"));
        }

        String normalized = email == null ? null : email.trim().toLowerCase();
        User user = (normalized == null || normalized.isBlank()) ? null
                : userRepository.findByEmailIgnoreCase(normalized);

        Map<String, Object> out = new HashMap<>();
        out.put("inputEmail", email);
        out.put("normalizedEmail", normalized);
        out.put("found", user != null);

        if (user != null) {
            out.put("userId", user.getId());
            out.put("storedEmail", user.getEmail());

            String stored = user.getPassword();
            boolean isNull = stored == null;
            boolean looksBcrypt = !isNull
                    && (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$"));
            boolean looksJwt = !isNull && stored.split("\\.").length == 3; // common accidental mistake

            out.put("passwordNull", isNull);
            out.put("passwordLooksBcrypt", looksBcrypt);
            out.put("passwordLooksJwt", looksJwt);
            out.put("passwordLength", isNull ? 0 : stored.length());
            out.put("passwordPrefix", isNull ? null : stored.substring(0, Math.min(10, stored.length())));
        }

        return ResponseEntity.ok(out);
    }

    public record UserSearchResult(Long id, String username, String name, String headline, String location, String email) {
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam("q") String q,
            @RequestParam(value = "limit", required = false, defaultValue = "10") int limit) {
        String query = q == null ? "" : q.trim();
        if (query.isBlank())
            return ResponseEntity.ok(List.of());

        int safeLimit = Math.max(1, Math.min(limit, 20));
        List<User> users = userRepository.searchUsers(query, PageRequest.of(0, safeLimit));

        List<UserSearchResult> out = users.stream()
                .map(u -> new UserSearchResult(u.getId(), u.getUsername(), u.getName(), u.getHeadline(), u.getLocation(), u.getEmail()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }
}