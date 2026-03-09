package com.linkup.backend.repository;

import com.linkup.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderEmailAndReceiverEmail(
            String sender, String receiver);
}