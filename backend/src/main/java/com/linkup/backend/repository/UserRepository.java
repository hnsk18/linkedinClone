package com.linkup.backend.repository;

import com.linkup.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findByEmailIgnoreCase(String email);

    @Query("""
            select u from User u
            where
              lower(u.name) like lower(concat('%', :q, '%'))
              or lower(u.email) like lower(concat('%', :q, '%'))
              or lower(u.headline) like lower(concat('%', :q, '%'))
              or lower(u.location) like lower(concat('%', :q, '%'))
            """)
    List<User> searchUsers(@Param("q") String q, Pageable pageable);

}