package com.linkup.backend.repository;

import com.linkup.backend.model.JobPreference;
import com.linkup.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobPreferenceRepository extends JpaRepository<JobPreference, Long> {
    Optional<JobPreference> findByUser(User user);
}
