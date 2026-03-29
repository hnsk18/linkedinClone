package com.linkup.backend.repository;

import com.linkup.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query(value = "SELECT * FROM post LIMIT ?1 OFFSET ?2", nativeQuery = true)
    List<Post> getPostsWithOffset(int limit, int offset);

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail);
}
