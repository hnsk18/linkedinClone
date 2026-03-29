package com.linkup.backend.service;

import com.linkup.backend.model.Connection;
import com.linkup.backend.model.ConnectionRequest;
import com.linkup.backend.model.User;
import com.linkup.backend.repository.ConnectionRepository;
import com.linkup.backend.repository.ConnectionRequestRepository;
import com.linkup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {

    public enum ConnectionStatus {
        NONE,
        PENDING_OUTGOING,
        PENDING_INCOMING,
        CONNECTED
    }

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private ConnectionRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    public ConnectionStatus getStatus(Long meId, Long otherId) {
        if (meId == null || otherId == null || meId.equals(otherId)) return ConnectionStatus.NONE;

        if (connectionRepository.findBetween(meId, otherId).isPresent()) {
            return ConnectionStatus.CONNECTED;
        }
        if (requestRepository.findByRequesterIdAndReceiverIdAndStatus(meId, otherId, ConnectionRequest.Status.PENDING).isPresent()) {
            return ConnectionStatus.PENDING_OUTGOING;
        }
        if (requestRepository.findByReceiverIdAndRequesterIdAndStatus(meId, otherId, ConnectionRequest.Status.PENDING).isPresent()) {
            return ConnectionStatus.PENDING_INCOMING;
        }
        return ConnectionStatus.NONE;
    }

    @Transactional
    public ConnectionRequest sendRequest(Long meId, Long toUserId) {
        if (meId == null || toUserId == null) throw new IllegalArgumentException("Missing user ids");
        if (meId.equals(toUserId)) throw new IllegalArgumentException("Cannot connect to yourself");

        // Already connected?
        if (connectionRepository.findBetween(meId, toUserId).isPresent()) {
            throw new IllegalStateException("Already connected");
        }

        // If there's an incoming pending request, accept it implicitly (nice UX).
        Optional<ConnectionRequest> incoming = requestRepository.findByReceiverIdAndRequesterIdAndStatus(meId, toUserId, ConnectionRequest.Status.PENDING);
        if (incoming.isPresent()) {
            acceptRequest(meId, incoming.get().getId());
            return incoming.get();
        }

        // Prevent duplicates
        Optional<ConnectionRequest> existing = requestRepository.findByRequesterIdAndReceiverIdAndStatus(meId, toUserId, ConnectionRequest.Status.PENDING);
        if (existing.isPresent()) return existing.get();

        ConnectionRequest req = new ConnectionRequest();
        req.setRequesterId(meId);
        req.setReceiverId(toUserId);
        req.setStatus(ConnectionRequest.Status.PENDING);
        return requestRepository.save(req);
    }

    public List<ConnectionRequest> listIncoming(Long meId) {
        return requestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(meId, ConnectionRequest.Status.PENDING);
    }

    public List<User> listConnections(Long meId) {
        List<Connection> conns = connectionRepository.findAllForUser(meId);
        List<Long> otherIds = conns.stream()
                .map(c -> meId.equals(c.getUserAId()) ? c.getUserBId() : c.getUserAId())
                .distinct()
                .toList();
        if (otherIds.isEmpty()) return List.of();
        return userRepository.findAllById(otherIds);
    }

    @Transactional
    public void acceptRequest(Long meId, Long requestId) {
        ConnectionRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        if (!meId.equals(req.getReceiverId())) throw new IllegalStateException("Not allowed");
        if (req.getStatus() != ConnectionRequest.Status.PENDING) return;

        req.setStatus(ConnectionRequest.Status.ACCEPTED);
        req.setRespondedAt(LocalDateTime.now());
        requestRepository.save(req);

        Long a = req.getRequesterId();
        Long b = req.getReceiverId();
        if (connectionRepository.findBetween(a, b).isEmpty()) {
            Connection c = new Connection();
            // store ordered to respect unique constraint
            if (a < b) { c.setUserAId(a); c.setUserBId(b); }
            else { c.setUserAId(b); c.setUserBId(a); }
            connectionRepository.save(c);
        }

        bumpConnectionsCount(a);
        bumpConnectionsCount(b);
    }

    @Transactional
    public void rejectRequest(Long meId, Long requestId) {
        ConnectionRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        if (!meId.equals(req.getReceiverId())) throw new IllegalStateException("Not allowed");
        if (req.getStatus() != ConnectionRequest.Status.PENDING) return;

        req.setStatus(ConnectionRequest.Status.REJECTED);
        req.setRespondedAt(LocalDateTime.now());
        requestRepository.save(req);
    }

    private void bumpConnectionsCount(Long userId) {
        User u = userRepository.findById(userId).orElse(null);
        if (u == null) return;
        Integer c = u.getConnectionsCount();
        u.setConnectionsCount((c == null ? 0 : c) + 1);
        userRepository.save(u);
    }
}

