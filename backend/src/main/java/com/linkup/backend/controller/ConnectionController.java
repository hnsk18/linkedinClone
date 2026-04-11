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

    public static class SendRequestBody {
        private Long toUserId;

        public Long getToUserId() {
            return toUserId;
        }

        public void setToUserId(Long toUserId) {
            this.toUserId = toUserId;
        }
    }

    @PostMapping("/request")
    public ResponseEntity<?> request(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody SendRequestBody body
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        if (body == null || body.getToUserId() == null) return ResponseEntity.badRequest().body("Missing toUserId");

        try {
            ConnectionRequest req = connectionService.sendRequest(me.getId(), body.getToUserId());
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

    public record ConnectionItem(Long userId, String name, String headline, String location, String email, String username) {}

    public record NetworkSuggestionsResponse(List<ConnectionItem> mutualConnections, List<ConnectionItem> peopleYouMayKnow) {}

    @GetMapping("/list")
    public ResponseEntity<?> list(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");

        List<User> users = connectionService.listConnections(me.getId());
        List<ConnectionItem> out = users.stream()
                .map(u -> new ConnectionItem(u.getId(), u.getName(), u.getHeadline(), u.getLocation(), u.getEmail(), u.getUsername()))
                .toList();
        return ResponseEntity.ok(out);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<?> suggestions(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");

        ConnectionService.NetworkSuggestions buckets = connectionService.listNetworkSuggestions(me.getId(), 40);
        List<ConnectionItem> mutual = buckets.mutualConnections.stream()
                .map(u -> new ConnectionItem(u.getId(), u.getName(), u.getHeadline(), u.getLocation(), u.getEmail(), u.getUsername()))
                .toList();
        List<ConnectionItem> discover = buckets.peopleYouMayKnow.stream()
                .map(u -> new ConnectionItem(u.getId(), u.getName(), u.getHeadline(), u.getLocation(), u.getEmail(), u.getUsername()))
                .toList();
        return ResponseEntity.ok(new NetworkSuggestionsResponse(mutual, discover));
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

    public record OutgoingRequestItem(
            Long requestId,
            Long toUserId,
            String toName,
            String toHeadline,
            String toLocation,
            String toEmail,
            String toUsername,
            String createdAt
    ) {}

    @GetMapping("/requests/outgoing")
    public ResponseEntity<?> outgoing(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");

        List<ConnectionRequest> reqs = connectionService.listOutgoingPending(me.getId());
        List<Long> toIds = reqs.stream().map(ConnectionRequest::getReceiverId).distinct().toList();
        Map<Long, User> byId = userRepository.findAllById(toIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<OutgoingRequestItem> out = reqs.stream().map(r -> {
            User to = byId.get(r.getReceiverId());
            return new OutgoingRequestItem(
                    r.getId(),
                    r.getReceiverId(),
                    to != null ? to.getName() : null,
                    to != null ? to.getHeadline() : null,
                    to != null ? to.getLocation() : null,
                    to != null ? to.getEmail() : null,
                    to != null ? to.getUsername() : null,
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

