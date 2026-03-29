package com.linkup.backend.repository;

import com.linkup.backend.model.Certification;
import com.linkup.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {

    List<Certification> findByUserOrderByIssueDateDesc(User user);
}

