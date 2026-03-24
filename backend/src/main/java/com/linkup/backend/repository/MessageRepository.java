package com.linkup.backend.repository;

import com.linkup.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderEmailAndReceiverEmail(
            String sender, String receiver);

    @Query("""
            select m from Message m
            where (lower(m.senderEmail) = lower(:a) and lower(m.receiverEmail) = lower(:b))
               or (lower(m.senderEmail) = lower(:b) and lower(m.receiverEmail) = lower(:a))
            order by m.timestamp asc
            """)
    List<Message> findThread(@Param("a") String a, @Param("b") String b);
}