package com.linkup.backend.service;

import com.linkup.backend.model.Comment;
import com.linkup.backend.model.Post;
import com.linkup.backend.repository.CommentRepository;
import com.linkup.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public Comment createComment(Long postId, Comment comment, String authorEmail, String authorName) {
        Optional<Post> post = postRepository.findById(postId);
        if (post.isEmpty()) {
            throw new IllegalArgumentException("Post not found with id: " + postId);
        }

        comment.setPost(post.get());
        comment.setAuthorEmail(authorEmail);
        comment.setAuthorName(authorName);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        if (post.isEmpty()) {
            throw new IllegalArgumentException("Post not found with id: " + postId);
        }
        return commentRepository.findByPostOrderByCreatedAtDesc(post.get());
    }

    public Optional<Comment> getCommentById(Long commentId) {
        return commentRepository.findById(commentId);
    }

    public Comment updateComment(Long commentId, Comment updatedComment, String authorEmail) {
        Optional<Comment> existingComment = commentRepository.findById(commentId);
        if (existingComment.isEmpty()) {
            throw new IllegalArgumentException("Comment not found with id: " + commentId);
        }

        Comment comment = existingComment.get();
        if (!comment.getAuthorEmail().equals(authorEmail)) {
            throw new IllegalArgumentException("You can only edit your own comments");
        }

        comment.setContent(updatedComment.getContent());
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, String authorEmail) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isEmpty()) {
            throw new IllegalArgumentException("Comment not found with id: " + commentId);
        }

        if (!comment.get().getAuthorEmail().equals(authorEmail)) {
            throw new IllegalArgumentException("You can only delete your own comments");
        }

        commentRepository.deleteById(commentId);
    }

    public Long getCommentCountByPostId(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        if (post.isEmpty()) {
            throw new IllegalArgumentException("Post not found with id: " + postId);
        }
        return (long) commentRepository.findByPostOrderByCreatedAtDesc(post.get()).size();
    }
}
