package com.linkup.backend.controller;

import com.linkup.backend.model.Post;
import com.linkup.backend.model.User;
import com.linkup.backend.repository.UserRepository;
import com.linkup.backend.service.FileStorageService;
import com.linkup.backend.service.PostService;
import com.linkup.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createPost(@RequestBody Post post, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            post.setAuthorEmail(email);
            User user = userRepository.findByEmail(email);
            if (user != null && user.getName() != null && !user.getName().isBlank()) {
                post.setAuthorName(user.getName());
            } else {
                post.setAuthorName(email);
            }
            return ResponseEntity.ok(postService.createPost(post));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPostWithMedia(
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email);
            String authorName = (user != null && user.getName() != null && !user.getName().isBlank())
                    ? user.getName() : email;

            boolean hasContent = content != null && !content.isBlank();
            boolean hasFiles = files != null && files.length > 0;
            if (!hasContent && !hasFiles) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post must have text or media");
            }

            String mediaUrlsJson = null;
            if (hasFiles) {
                List<String> urls = fileStorageService.storeFiles(files);
                if (!urls.isEmpty()) {
                    mediaUrlsJson = "[\"" + String.join("\",\"", urls) + "\"]";
                }
            }

            Post post = new Post();
            post.setContent(content != null && !content.isBlank() ? content.trim() : "");
            post.setAuthorEmail(email);
            post.setAuthorName(authorName);
            post.setMediaUrls(mediaUrlsJson);
            return ResponseEntity.ok(postService.createPost(post));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save file");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @GetMapping("/feed")
    public List<Post> getFeed(@RequestParam(defaultValue = "10") int size){
        return postService.getFeed(size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id) {
        return postService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/repost")
    public ResponseEntity<?> repost(
            @RequestBody RepostRequest body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email);
            String authorName = (user != null && user.getName() != null && !user.getName().isBlank())
                    ? user.getName() : email;
            String content = (body != null && body.content != null) ? body.content.trim() : "";
            Post repost = postService.createRepost(body.originalPostId, email, authorName, content);
            return ResponseEntity.ok(repost);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    public static class RepostRequest {
        public Long originalPostId;
        public String content;
    }
}