package com.linkup.backend.repository;

import com.linkup.backend.model.PostReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {

    Optional<PostReaction> findByPostIdAndUserEmail(Long postId, String userEmail);

    List<PostReaction> findByPostIdOrderByUpdatedAtDesc(Long postId);

    List<PostReaction> findByPostIdAndTypeOrderByUpdatedAtDesc(Long postId, String type);

    long countByPostId(Long postId);

    long countByPostIdAndType(Long postId, String type);

    @Query("select r.type as type, count(r) as count from PostReaction r where r.post.id = :postId group by r.type")
    List<TypeCount> countByType(@Param("postId") Long postId);

    interface TypeCount {
        String getType();
        long getCount();
    }
}

