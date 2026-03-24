package com.linkup.backend.repository;

import com.linkup.backend.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("""
            select c from Connection c
            where (c.userAId = :a and c.userBId = :b) or (c.userAId = :b and c.userBId = :a)
            """)
    Optional<Connection> findBetween(@Param("a") Long a, @Param("b") Long b);

    @Query("""
            select c from Connection c
            where c.userAId = :userId or c.userBId = :userId
            order by c.createdAt desc
            """)
    List<Connection> findAllForUser(@Param("userId") Long userId);
}

