package com.brian.website.controller;

import com.brian.website.model.BlogPost;
import com.brian.website.service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<List<BlogPost>> getPublishedPosts() {
        return ResponseEntity.ok(blogService.getPublishedPosts());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPost> getPost(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBySlug(slug));
    }
}
