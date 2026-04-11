package com.linkup.backend.service;

import com.linkup.backend.model.User;
import com.linkup.backend.model.UserNotification;
import com.linkup.backend.repository.UserNotificationRepository;
import com.linkup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private UserNotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void notifyConnectionAccepted(Long requesterUserId, Long accepterUserId, Long requestId) {
        if (requesterUserId == null || accepterUserId == null) return;
        User accepter = userRepository.findById(accepterUserId).orElse(null);
        String name = accepter != null && accepter.getName() != null && !accepter.getName().isBlank()
                ? accepter.getName() : "Someone";
        UserNotification n = new UserNotification();
        n.setRecipientUserId(requesterUserId);
        n.setType(UserNotification.Type.CONNECTION_ACCEPTED);
        n.setActorUserId(accepterUserId);
        n.setRelatedConnectionRequestId(requestId);
        n.setMessage(name + " accepted your connection request");
        n.setReadFlag(false);
        notificationRepository.save(n);
    }

    @Transactional
    public void notifyConnectionRejected(Long requesterUserId, Long rejectorUserId, Long requestId) {
        if (requesterUserId == null || rejectorUserId == null) return;
        User rejector = userRepository.findById(rejectorUserId).orElse(null);
        String name = rejector != null && rejector.getName() != null && !rejector.getName().isBlank()
                ? rejector.getName() : "Someone";
        UserNotification n = new UserNotification();
        n.setRecipientUserId(requesterUserId);
        n.setType(UserNotification.Type.CONNECTION_REJECTED);
        n.setActorUserId(rejectorUserId);
        n.setRelatedConnectionRequestId(requestId);
        n.setMessage(name + " declined your connection request");
        n.setReadFlag(false);
        notificationRepository.save(n);
    }

    @Transactional
    public void notifyPostReaction(String authorEmail, String actorEmail, Long actorUserId, String actorName,
                                   Long postId, String reactionType) {
        if (authorEmail == null || actorEmail == null || postId == null) return;
        if (authorEmail.equalsIgnoreCase(actorEmail)) return;
        User author = userRepository.findByEmailIgnoreCase(authorEmail.trim());
        if (author == null) return;
        String label = actorName != null && !actorName.isBlank() ? actorName : actorEmail;
        String rt = reactionType != null ? reactionType.trim().toLowerCase(Locale.ROOT) : "like";
        UserNotification n = new UserNotification();
        n.setRecipientUserId(author.getId());
        n.setType(UserNotification.Type.POST_REACTION);
        n.setActorUserId(actorUserId);
        n.setRelatedPostId(postId);
        n.setMessage(label + " reacted to your post (" + rt + ")");
        n.setReadFlag(false);
        notificationRepository.save(n);
    }

    @Transactional
    public void notifyPostComment(String authorEmail, String commenterEmail, Long commenterUserId,
                                  String commenterName, Long postId, String commentPreview) {
        if (authorEmail == null || commenterEmail == null || postId == null) return;
        if (authorEmail.equalsIgnoreCase(commenterEmail)) return;
        User author = userRepository.findByEmailIgnoreCase(authorEmail.trim());
        if (author == null) return;
        String label = commenterName != null && !commenterName.isBlank() ? commenterName : commenterEmail;
        String preview = commentPreview == null ? "" : commentPreview.trim();
        if (preview.length() > 80) preview = preview.substring(0, 77) + "...";
        UserNotification n = new UserNotification();
        n.setRecipientUserId(author.getId());
        n.setType(UserNotification.Type.POST_COMMENT);
        n.setActorUserId(commenterUserId);
        n.setRelatedPostId(postId);
        n.setMessage(label + " commented on your post: " + preview);
        n.setReadFlag(false);
        notificationRepository.save(n);
    }

    public List<UserNotification> listForUser(Long recipientUserId, String filter) {
        List<UserNotification> all = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(recipientUserId);
        if (filter == null || filter.isBlank() || "all".equalsIgnoreCase(filter)) {
            return all;
        }
        if ("connections".equalsIgnoreCase(filter)) {
            return all.stream().filter(n ->
                    n.getType() == UserNotification.Type.CONNECTION_ACCEPTED
                            || n.getType() == UserNotification.Type.CONNECTION_REJECTED
            ).toList();
        }
        if ("posts".equalsIgnoreCase(filter) || "my_posts".equalsIgnoreCase(filter)) {
            return all.stream().filter(n ->
                    n.getType() == UserNotification.Type.POST_REACTION
                            || n.getType() == UserNotification.Type.POST_COMMENT
            ).toList();
        }
        if ("jobs".equalsIgnoreCase(filter) || "mention".equalsIgnoreCase(filter) || "mentions".equalsIgnoreCase(filter)) {
            return List.of();
        }
        return all;
    }

    public long unreadCount(Long recipientUserId) {
        return notificationRepository.countByRecipientUserIdAndReadFlagIsFalse(recipientUserId);
    }

    @Transactional
    public boolean markRead(Long recipientUserId, Long notificationId) {
        Optional<UserNotification> opt = notificationRepository.findById(notificationId);
        if (opt.isEmpty()) return false;
        UserNotification n = opt.get();
        if (!n.getRecipientUserId().equals(recipientUserId)) return false;
        n.setReadFlag(true);
        notificationRepository.save(n);
        return true;
    }

    @Transactional
    public void markAllRead(Long recipientUserId) {
        List<UserNotification> list = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(recipientUserId);
        for (UserNotification n : list) {
            if (!n.isReadFlag()) {
                n.setReadFlag(true);
                notificationRepository.save(n);
            }
        }
    }
}
