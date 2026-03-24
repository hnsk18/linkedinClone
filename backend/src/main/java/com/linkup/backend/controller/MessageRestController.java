package com.linkup.backend.controller;

import com.linkup.backend.model.Message;
import com.linkup.backend.model.User;
import com.linkup.backend.repository.MessageRepository;
import com.linkup.backend.repository.UserRepository;
import com.linkup.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageRestController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

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

    @GetMapping("/thread")
    public ResponseEntity<?> thread(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam("with") String withEmail
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");
        String other = withEmail == null ? "" : withEmail.trim();
        if (other.isBlank()) return ResponseEntity.badRequest().body("Missing with");
        List<Message> msgs = messageRepository.findThread(me.getEmail(), other);
        return ResponseEntity.ok(msgs);
    }
}

