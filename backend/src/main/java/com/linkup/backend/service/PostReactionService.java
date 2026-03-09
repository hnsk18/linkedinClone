package com.linkup.backend.service;

import com.linkup.backend.model.Post;
import com.linkup.backend.model.PostReaction;
import com.linkup.backend.repository.PostReactionRepository;
import com.linkup.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PostReactionService {

    public static final Set<String> ALLOWED_TYPES = Set.of(
            "LIKE",
            "CELEBRATE",
            "SUPPORT",
            "LOVE",
            "INSIGHTFUL",
            "FUNNY"
    );

    @Autowired
    private PostReactionRepository reactionRepository;

    @Autowired
    private PostRepository postRepository;

    @Transactional
    public void setReaction(Long postId, String userEmail, String userName, String type) {
        if (type == null || type.isBlank() || "NONE".equalsIgnoreCase(type)) {
            reactionRepository.findByPostIdAndUserEmail(postId, userEmail)
                    .ifPresent(reactionRepository::delete);
            return;
        }

        String normalized = type.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_TYPES.contains(normalized)) {
            throw new IllegalArgumentException("Invalid reaction type");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        PostReaction reaction = reactionRepository.findByPostIdAndUserEmail(postId, userEmail)
                .orElseGet(PostReaction::new);

        reaction.setPost(post);
        reaction.setUserEmail(userEmail);
        reaction.setUserName((userName == null || userName.isBlank()) ? userEmail : userName);
        reaction.setType(normalized);

        reactionRepository.save(reaction);
    }

    public Map<String, Long> getCountsByType(Long postId) {
        Map<String, Long> map = new HashMap<>();
        for (PostReactionRepository.TypeCount tc : reactionRepository.countByType(postId)) {
            map.put(tc.getType(), tc.getCount());
        }
        return map;
    }

    public long getTotalCount(Long postId) {
        return reactionRepository.countByPostId(postId);
    }

    public String getCurrentUserType(Long postId, String userEmail) {
        if (userEmail == null || userEmail.isBlank()) return null;
        return reactionRepository.findByPostIdAndUserEmail(postId, userEmail)
                .map(PostReaction::getType)
                .orElse(null);
    }

    public List<PostReaction> getReactions(Long postId, String type) {
        if (type == null || type.isBlank() || "ALL".equalsIgnoreCase(type)) {
            return reactionRepository.findByPostIdOrderByUpdatedAtDesc(postId);
        }
        String normalized = type.trim().toUpperCase(Locale.ROOT);
        return reactionRepository.findByPostIdAndTypeOrderByUpdatedAtDesc(postId, normalized);
    }
}

