package com.linkup.backend.repository;

import com.linkup.backend.model.Comment;
import com.linkup.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
    List<Comment> findByAuthorEmail(String authorEmail);

    long countByPost_Id(Long postId);

    List<Comment> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail, Pageable pageable);
}
