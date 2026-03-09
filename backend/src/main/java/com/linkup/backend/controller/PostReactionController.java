package com.linkup.backend.controller;

import com.linkup.backend.model.PostReaction;
import com.linkup.backend.model.User;
import com.linkup.backend.repository.UserRepository;
import com.linkup.backend.service.PostReactionService;
import com.linkup.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/posts/{postId}/reactions")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class PostReactionController {

    @Autowired
    private PostReactionService reactionService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    public static class ReactionRequest {
        public String type;
    }

    @PostMapping
    public ResponseEntity<?> setReaction(
            @PathVariable Long postId,
            @RequestBody ReactionRequest body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email);
            String name = (user != null) ? user.getName() : null;

            reactionService.setReaction(postId, email, name, body != null ? body.type : null);
            return ResponseEntity.ok(getSummaryInternal(postId, email));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid reaction type");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary(
            @PathVariable Long postId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                email = jwtUtil.extractEmail(authHeader.substring(7));
            } catch (Exception ignored) {
                email = null;
            }
        }
        return getSummaryInternal(postId, email);
    }

    @GetMapping
    public List<Map<String, Object>> list(
            @PathVariable Long postId,
            @RequestParam(value = "type", required = false) String type
    ) {
        List<PostReaction> reactions = reactionService.getReactions(postId, type);
        List<Map<String, Object>> out = new ArrayList<>();
        for (PostReaction r : reactions) {
            Map<String, Object> m = new HashMap<>();
            m.put("userName", r.getUserName());
            m.put("userEmail", r.getUserEmail());
            m.put("type", r.getType());
            m.put("updatedAt", r.getUpdatedAt());
            out.add(m);
        }
        return out;
    }

    private Map<String, Object> getSummaryInternal(Long postId, String email) {
        Map<String, Long> byType = reactionService.getCountsByType(postId);
        long total = byType.values().stream().mapToLong(Long::longValue).sum();

        List<String> topTypes = byType.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(3)
                .map(Map.Entry::getKey)
                .toList();

        String currentUserType = reactionService.getCurrentUserType(postId, email);

        Map<String, Object> res = new HashMap<>();
        res.put("total", total);
        res.put("byType", byType);
        res.put("topTypes", topTypes);
        res.put("currentUserType", currentUserType);
        return res;
    }
}

