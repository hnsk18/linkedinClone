package com.linkup.backend.controller;

import com.linkup.backend.model.ConnectionRequest;
import com.linkup.backend.model.User;
import com.linkup.backend.repository.UserRepository;
import com.linkup.backend.service.ConnectionService;
import com.linkup.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "*")
public class ConnectionController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConnectionService connectionService;

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

    public record StatusResponse(String status) {}

    @GetMapping("/status")
    public ResponseEntity<?> status(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam("userId") Long otherUserId
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        String s = connectionService.getStatus(me.getId(), otherUserId).name();
        return ResponseEntity.ok(new StatusResponse(s));
    }

    public record SendRequestBody(Long toUserId) {}

    @PostMapping("/request")
    public ResponseEntity<?> request(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody SendRequestBody body
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        if (body == null || body.toUserId() == null) return ResponseEntity.badRequest().body("Missing toUserId");

        try {
            ConnectionRequest req = connectionService.sendRequest(me.getId(), body.toUserId());
            return ResponseEntity.ok(req);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    public record IncomingRequestItem(
            Long requestId,
            Long fromUserId,
            String fromName,
            String fromHeadline,
            String fromLocation,
            String fromEmail,
            String createdAt
    ) {}

    public record ConnectionItem(Long userId, String name, String headline, String location, String email) {}

    @GetMapping("/list")
    public ResponseEntity<?> list(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");

        List<User> users = connectionService.listConnections(me.getId());
        List<ConnectionItem> out = users.stream()
                .map(u -> new ConnectionItem(u.getId(), u.getName(), u.getHeadline(), u.getLocation(), u.getEmail()))
                .toList();
        return ResponseEntity.ok(out);
    }

    @GetMapping("/requests/incoming")
    public ResponseEntity<?> incoming(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");

        List<ConnectionRequest> reqs = connectionService.listIncoming(me.getId());
        List<Long> fromIds = reqs.stream().map(ConnectionRequest::getRequesterId).distinct().toList();
        Map<Long, User> byId = userRepository.findAllById(fromIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<IncomingRequestItem> out = reqs.stream().map(r -> {
            User from = byId.get(r.getRequesterId());
            return new IncomingRequestItem(
                    r.getId(),
                    r.getRequesterId(),
                    from != null ? from.getName() : null,
                    from != null ? from.getHeadline() : null,
                    from != null ? from.getLocation() : null,
                    from != null ? from.getEmail() : null,
                    r.getCreatedAt() != null ? r.getCreatedAt().toString() : null
            );
        }).toList();

        return ResponseEntity.ok(out);
    }

    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<?> accept(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long requestId
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        try {
            connectionService.acceptRequest(me.getId(), requestId);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<?> reject(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long requestId
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        try {
            connectionService.rejectRequest(me.getId(), requestId);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}

