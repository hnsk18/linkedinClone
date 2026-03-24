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

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.registerUser(user);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user){

        User loggedUser = userService.login(
                user != null ? user.getEmail() : null,
                user != null ? user.getPassword() : null
        );

        if(loggedUser == null){
            return ResponseEntity.status(401).body("Invalid email or password");
        }

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

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid token");
        }
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email);
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
    @RequestMapping(value = "/debug/check-email", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> debugCheckEmail(
            @RequestParam(value = "email", required = false) String email,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        if ((email == null || email.isBlank()) && body != null && body.get("email") != null) {
            email = String.valueOf(body.get("email"));
        }

        String normalized = email == null ? null : email.trim().toLowerCase();
        User user = (normalized == null || normalized.isBlank()) ? null : userRepository.findByEmailIgnoreCase(normalized);

        Map<String, Object> out = new HashMap<>();
        out.put("inputEmail", email);
        out.put("normalizedEmail", normalized);
        out.put("found", user != null);

        if (user != null) {
            out.put("userId", user.getId());
            out.put("storedEmail", user.getEmail());

            String stored = user.getPassword();
            boolean isNull = stored == null;
            boolean looksBcrypt = !isNull && (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$"));
            boolean looksJwt = !isNull && stored.split("\\.").length == 3; // common accidental mistake

            out.put("passwordNull", isNull);
            out.put("passwordLooksBcrypt", looksBcrypt);
            out.put("passwordLooksJwt", looksJwt);
            out.put("passwordLength", isNull ? 0 : stored.length());
            out.put("passwordPrefix", isNull ? null : stored.substring(0, Math.min(10, stored.length())));
        }

        return ResponseEntity.ok(out);
    }

    public record UserSearchResult(Long id, String name, String headline, String location, String email) {}

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam("q") String q,
            @RequestParam(value = "limit", required = false, defaultValue = "10") int limit
    ) {
        String query = q == null ? "" : q.trim();
        if (query.isBlank()) return ResponseEntity.ok(List.of());

        int safeLimit = Math.max(1, Math.min(limit, 20));
        List<User> users = userRepository.searchUsers(query, PageRequest.of(0, safeLimit));

        List<UserSearchResult> out = users.stream()
                .map(u -> new UserSearchResult(u.getId(), u.getName(), u.getHeadline(), u.getLocation(), u.getEmail()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }
}