package com.linkup.backend.repository;

import com.linkup.backend.model.User;
import com.linkup.backend.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findByUser(User user);

    UserSkill findByUserAndSkill(User user, com.linkup.backend.model.Skill skill);
}

