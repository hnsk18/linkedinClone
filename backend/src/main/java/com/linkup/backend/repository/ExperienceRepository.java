package com.linkup.backend.repository;

import com.linkup.backend.model.Experience;
import com.linkup.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    List<Experience> findByUserOrderByStartDateDesc(User user);
}

