package com.linkup.backend.repository;

import com.linkup.backend.model.Education;
import com.linkup.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Long> {

    List<Education> findByUserOrderByStartYearDesc(User user);
}

