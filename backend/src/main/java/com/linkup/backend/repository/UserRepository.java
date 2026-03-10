package com.linkup.backend.repository;

import com.linkup.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findByEmailIgnoreCase(String email);

}