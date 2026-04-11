package com.linkup.backend.repository;

import com.linkup.backend.model.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {

    List<UserNotification> findByRecipientUserIdOrderByCreatedAtDesc(Long recipientUserId);

    long countByRecipientUserIdAndReadFlagIsFalse(Long recipientUserId);
}
