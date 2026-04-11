package com.linkup.backend.controller;

import com.linkup.backend.model.User;
import com.linkup.backend.model.UserNotification;
import com.linkup.backend.repository.UserRepository;
import com.linkup.backend.service.NotificationService;
import com.linkup.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    private User requireMe(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            if (email == null) return null;
            return userRepository.findByEmailIgnoreCase(email.trim());
        } catch (Exception e) {
            return null;
        }
    }

    public record NotificationItem(
            Long id,
            String type,
            String message,
            Long actorUserId,
            String actorName,
            String actorUsername,
            Long relatedPostId,
            Long relatedConnectionRequestId,
            boolean read,
            String createdAt
    ) {}

    private NotificationItem toItem(UserNotification n) {
        String actorName = null;
        String actorUsername = null;
        if (n.getActorUserId() != null) {
            User actor = userRepository.findById(n.getActorUserId()).orElse(null);
            if (actor != null) {
                actorName = actor.getName();
                actorUsername = actor.getUsername();
            }
        }
        return new NotificationItem(
                n.getId(),
                n.getType().name(),
                n.getMessage(),
                n.getActorUserId(),
                actorName,
                actorUsername,
                n.getRelatedPostId(),
                n.getRelatedConnectionRequestId(),
                n.isReadFlag(),
                n.getCreatedAt() != null ? n.getCreatedAt().toString() : null
        );
    }

    @GetMapping
    public ResponseEntity<?> list(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "filter", defaultValue = "all") String filter
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        List<NotificationItem> out = notificationService.listForUser(me.getId(), filter).stream()
                .map(this::toItem)
                .toList();
        return ResponseEntity.ok(out);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        return ResponseEntity.ok(Map.of("count", notificationService.unreadCount(me.getId())));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markRead(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        boolean ok = notificationService.markRead(me.getId(), id);
        if (!ok) return ResponseEntity.status(404).body("Not found");
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/read-all")
    public ResponseEntity<?> markAllRead(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        notificationService.markAllRead(me.getId());
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
