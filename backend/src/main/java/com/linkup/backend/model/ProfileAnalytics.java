package com.linkup.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ProfileAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Long profileViews;

    private Long postImpressions;

    private Long searchAppearances;

    public ProfileAnalytics() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonIgnore
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getProfileViews() {
        return profileViews;
    }

    public void setProfileViews(Long profileViews) {
        this.profileViews = profileViews;
    }

    public Long getPostImpressions() {
        return postImpressions;
    }

    public void setPostImpressions(Long postImpressions) {
        this.postImpressions = postImpressions;
    }

    public Long getSearchAppearances() {
        return searchAppearances;
    }

    public void setSearchAppearances(Long searchAppearances) {
        this.searchAppearances = searchAppearances;
    }
}

