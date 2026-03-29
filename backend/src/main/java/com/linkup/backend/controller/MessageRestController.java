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
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.ArrayList;

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

    /** Returns the full message thread between the current user and another email. */
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

    /**
     * Returns one conversation preview per unique contact, sorted by most recent message first.
     * Each item: { otherEmail, lastMessage, timestamp }
     */
    @GetMapping("/conversations")
    public ResponseEntity<?> conversations(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        User me = requireMe(authHeader);
        if (me == null) return ResponseEntity.status(401).body("Missing or invalid token");

        List<Message> latest = messageRepository.findLatestPerConversation(me.getEmail());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Message m : latest) {
            String other = m.getSenderEmail().equalsIgnoreCase(me.getEmail())
                    ? m.getReceiverEmail()
                    : m.getSenderEmail();
            User otherUser = userRepository.findByEmailIgnoreCase(other);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("otherEmail", other);
            item.put("otherName", otherUser != null ? otherUser.getName() : other);
            item.put("lastMessage", m.getContent());
            item.put("timestamp", m.getTimestamp());
            item.put("isMine", m.getSenderEmail().equalsIgnoreCase(me.getEmail()));
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }
}
