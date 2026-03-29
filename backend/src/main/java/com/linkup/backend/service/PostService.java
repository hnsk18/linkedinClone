package com.linkup.backend.service;

import com.linkup.backend.model.Post;
import com.linkup.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(Post post){
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    public List<Post> getFeed(int size){
        long count = postRepository.count();

        if (count == 0) {
            return List.of();
        }

        int maxOffset = (int) (count - size);
        int randomOffset = maxOffset > 0 ? new Random().nextInt(maxOffset + 1) : 0;

        return postRepository.getPostsWithOffset(size, randomOffset);
    }

    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

    public Post createRepost(Long originalPostId, String authorEmail, String authorName, String content) {
        Post original = postRepository.findById(originalPostId)
                .orElseThrow(() -> new IllegalArgumentException("Original post not found"));
        Post repost = new Post();
        repost.setContent(content != null ? content : "");
        repost.setAuthorEmail(authorEmail);
        repost.setAuthorName(authorName);
        repost.setRepostOfId(original.getId());
        repost.setCreatedAt(LocalDateTime.now());
        return postRepository.save(repost);
    }
}