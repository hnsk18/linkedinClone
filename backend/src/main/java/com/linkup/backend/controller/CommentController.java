package com.linkup.backend.controller;

import com.linkup.backend.model.Comment;
import com.linkup.backend.model.User;
import com.linkup.backend.repository.UserRepository;
import com.linkup.backend.service.CommentService;
import com.linkup.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createComment(
            @RequestParam Long postId,
            @RequestBody Map<String, String> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            
            String content = request.get("content");
            if (content == null || content.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Comment content cannot be empty");
            }

            User user = (email != null && !email.isBlank())
                    ? userRepository.findByEmailIgnoreCase(email.trim())
                    : null;
            String authorName = (user != null && user.getName() != null && !user.getName().isBlank())
                    ? user.getName() : email;

            Comment comment = new Comment();
            comment.setContent(content.trim());

            Comment savedComment = commentService.createComment(postId, comment, email, authorName);
            return ResponseEntity.ok(savedComment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @GetMapping
    public ResponseEntity<?> getCommentsByPost(@RequestParam Long postId) {
        try {
            List<Comment> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<?> getCommentById(@PathVariable Long commentId) {
        try {
            return ResponseEntity.ok(commentService.getCommentById(commentId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @RequestBody Map<String, String> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            String content = request.get("content");
            if (content == null || content.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Comment content cannot be empty");
            }

            Comment updatedComment = new Comment();
            updatedComment.setContent(content.trim());

            Comment result = commentService.updateComment(commentId, updatedComment, email);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            
            commentService.deleteComment(commentId, email);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<?> getCommentCount(@PathVariable Long postId) {
        try {
            Long count = commentService.getCommentCountByPostId(postId);
            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
