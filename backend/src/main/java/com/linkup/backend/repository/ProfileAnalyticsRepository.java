package com.linkup.backend.repository;

import com.linkup.backend.model.ProfileAnalytics;
import com.linkup.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileAnalyticsRepository extends JpaRepository<ProfileAnalytics, Long> {

    ProfileAnalytics findByUser(User user);
}

