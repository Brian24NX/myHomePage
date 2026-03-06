package com.brian.website.repository;

import com.brian.website.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByPublishedTrueOrderByCreatedAtDesc();
    Optional<BlogPost> findBySlug(String slug);
}
