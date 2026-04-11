package com.linkup.backend.dto;

import java.time.LocalDateTime;

/** A comment authored by the profile user (for Activity → Comments tab). */
public class CommentActivityDto {

    private Long id;
    private Long postId;
    private String content;
    private LocalDateTime createdAt;

    public CommentActivityDto() {}

    public CommentActivityDto(Long id, Long postId, String content, LocalDateTime createdAt) {
        this.id = id;
        this.postId = postId;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
