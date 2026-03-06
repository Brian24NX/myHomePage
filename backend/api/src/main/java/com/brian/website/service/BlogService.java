package com.brian.website.service;

import com.brian.website.model.BlogPost;
import com.brian.website.repository.BlogPostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public BlogService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public List<BlogPost> getPublishedPosts() {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    public BlogPost getBySlug(String slug) {
        return blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found: " + slug));
    }

    public BlogPost getById(Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));
    }

    public BlogPost create(BlogPost post) {
        if (post.getSlug() == null || post.getSlug().isEmpty()) {
            post.setSlug(generateSlug(post.getTitle()));
        }
        post.setReadTime(estimateReadTime(post.getContent()));
        return blogPostRepository.save(post);
    }

    public BlogPost update(Long id, BlogPost updated) {
        BlogPost existing = getById(id);
        existing.setTitle(updated.getTitle());
        existing.setSlug(updated.getSlug());
        existing.setSummary(updated.getSummary());
        existing.setContent(updated.getContent());
        existing.setCoverImage(updated.getCoverImage());
        existing.setPublished(updated.isPublished());
        existing.setTags(updated.getTags());
        existing.setReadTime(estimateReadTime(updated.getContent()));
        return blogPostRepository.save(existing);
    }

    public void delete(Long id) {
        blogPostRepository.deleteById(id);
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private int estimateReadTime(String content) {
        if (content == null || content.isEmpty()) return 1;
        int words = content.split("\\s+").length;
        return Math.max(1, words / 200);
    }
}
