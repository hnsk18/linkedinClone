package com.linkup.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.Lob;

@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    private String authorEmail;
    private String authorName;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String mediaUrls;

    private LocalDateTime createdAt;

    @Column(name = "repost_of_id")
    private Long repostOfId;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comment> comments;

    public Post(){}

    public Long getId(){ return id; }

    public String getContent(){ return content; }

    public void setContent(String content){
        this.content = content;
    }

    public String getAuthorEmail(){
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail){
        this.authorEmail = authorEmail;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(String mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
    }

    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt = createdAt;
    }

    public Long getRepostOfId() { return repostOfId; }
    public void setRepostOfId(Long repostOfId) { this.repostOfId = repostOfId; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
}