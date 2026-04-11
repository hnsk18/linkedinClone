package com.linkup.backend.repository;

import com.linkup.backend.model.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    Optional<ConnectionRequest> findByRequesterIdAndReceiverId(Long requesterId, Long receiverId);

    List<ConnectionRequest> findByReceiverIdAndStatusOrderByCreatedAtDesc(Long receiverId, ConnectionRequest.Status status);

    Optional<ConnectionRequest> findByRequesterIdAndReceiverIdAndStatus(Long requesterId, Long receiverId, ConnectionRequest.Status status);

    Optional<ConnectionRequest> findByReceiverIdAndRequesterIdAndStatus(Long receiverId, Long requesterId, ConnectionRequest.Status status);

    List<ConnectionRequest> findByRequesterIdAndStatus(Long requesterId, ConnectionRequest.Status status);

    List<ConnectionRequest> findByRequesterIdAndStatusOrderByCreatedAtDesc(Long requesterId, ConnectionRequest.Status status);
}

