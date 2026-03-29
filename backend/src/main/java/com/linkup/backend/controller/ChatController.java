package com.linkup.backend.controller;

import com.linkup.backend.model.Message;
import com.linkup.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/send")
    public Message sendMessage(Message message) {

        messageRepository.save(message);

        // Direct message: deliver to both users' queues.
        if (message != null && message.getReceiverEmail() != null && !message.getReceiverEmail().isBlank()) {
            String sender = message.getSenderEmail();
            String receiver = message.getReceiverEmail();
            if (sender != null && !sender.isBlank()) {
                messagingTemplate.convertAndSendToUser(sender, "/queue/messages", message);
            }
            messagingTemplate.convertAndSendToUser(receiver, "/queue/messages", message);
            return message;
        }

        // Fallback: broadcast (legacy global chat)
        messagingTemplate.convertAndSend("/topic/messages", message);
        return message;
    }
}