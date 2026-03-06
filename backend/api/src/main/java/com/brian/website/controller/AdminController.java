package com.brian.website.controller;

import com.brian.website.model.BlogPost;
import com.brian.website.model.ContactMessage;
import com.brian.website.service.BlogService;
import com.brian.website.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BlogService blogService;
    private final ContactService contactService;

    public AdminController(BlogService blogService, ContactService contactService) {
        this.blogService = blogService;
        this.contactService = contactService;
    }

    // === Blog Management ===

    @GetMapping("/blog")
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        return ResponseEntity.ok(blogService.getAllPosts());
    }

    @PostMapping("/blog")
    public ResponseEntity<BlogPost> createPost(@RequestBody BlogPost post) {
        return ResponseEntity.ok(blogService.create(post));
    }

    @PutMapping("/blog/{id}")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody BlogPost post) {
        return ResponseEntity.ok(blogService.update(id, post));
    }

    @DeleteMapping("/blog/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Post deleted"));
    }

    // === Messages Management ===

    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    @GetMapping("/messages/unread")
    public ResponseEntity<List<ContactMessage>> getUnreadMessages() {
        return ResponseEntity.ok(contactService.getUnreadMessages());
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.markAsRead(id));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok(Map.of("message", "Message deleted"));
    }

    // === Dashboard Stats ===

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        List<BlogPost> allPosts = blogService.getAllPosts();
        List<ContactMessage> unread = contactService.getUnreadMessages();
        List<ContactMessage> allMessages = contactService.getAllMessages();

        long publishedCount = allPosts.stream().filter(BlogPost::isPublished).count();

        return ResponseEntity.ok(Map.of(
                "totalPosts", allPosts.size(),
                "publishedPosts", publishedCount,
                "draftPosts", allPosts.size() - publishedCount,
                "totalMessages", allMessages.size(),
                "unreadMessages", unread.size()
        ));
    }
}
