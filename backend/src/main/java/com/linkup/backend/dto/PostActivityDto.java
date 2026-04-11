package com.linkup.backend.dto;

import com.linkup.backend.model.Post;

import java.time.LocalDateTime;

/**
 * Post row for profile Activity with engagement counts.
 */
public class PostActivityDto {

    private Long id;
    private String content;
    private String authorEmail;
    private String authorName;
    private String mediaUrls;
    private LocalDateTime createdAt;
    private Long repostOfId;
    private long likesCount;
    private long commentsCount;
    private boolean hasVideo;

    public PostActivityDto() {}

    public PostActivityDto(Post post, long likesCount, long commentsCount, boolean hasVideo) {
        this.id = post.getId();
        this.content = post.getContent();
        this.authorEmail = post.getAuthorEmail();
        this.authorName = post.getAuthorName();
        this.mediaUrls = post.getMediaUrls();
        this.createdAt = post.getCreatedAt();
        this.repostOfId = post.getRepostOfId();
        this.likesCount = likesCount;
        this.commentsCount = commentsCount;
        this.hasVideo = hasVideo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthorEmail() { return authorEmail; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(String mediaUrls) { this.mediaUrls = mediaUrls; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Long getRepostOfId() { return repostOfId; }
    public void setRepostOfId(Long repostOfId) { this.repostOfId = repostOfId; }
    public long getLikesCount() { return likesCount; }
    public void setLikesCount(long likesCount) { this.likesCount = likesCount; }
    public long getCommentsCount() { return commentsCount; }
    public void setCommentsCount(long commentsCount) { this.commentsCount = commentsCount; }
    public boolean isHasVideo() { return hasVideo; }
    public void setHasVideo(boolean hasVideo) { this.hasVideo = hasVideo; }
}
