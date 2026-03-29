package com.linkup.backend.repository;

import com.linkup.backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    Skill findByNameIgnoreCase(String name);
}

