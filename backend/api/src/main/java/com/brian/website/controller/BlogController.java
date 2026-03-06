package com.brian.website.controller;

import com.brian.website.model.BlogPost;
import com.brian.website.service.BlogService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

    private final BlogService blogService;

    @Value("${app.frontend-url:https://brianzhou.dev}")
    private String frontendUrl;

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

    @GetMapping(value = "/rss", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getRssFeed() {
        List<BlogPost> posts = blogService.getPublishedPosts();
        DateTimeFormatter rfc822 = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss '+0000'");

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n");
        xml.append("<channel>\n");
        xml.append("  <title>Brian Zhou's Blog</title>\n");
        xml.append("  <link>").append(escapeXml(frontendUrl)).append("/blog</link>\n");
        xml.append("  <description>Thoughts on code, tech, and everything in between.</description>\n");
        xml.append("  <language>en-us</language>\n");

        for (BlogPost post : posts) {
            xml.append("  <item>\n");
            xml.append("    <title>").append(escapeXml(post.getTitle())).append("</title>\n");
            xml.append("    <link>").append(escapeXml(frontendUrl)).append("/blog/").append(escapeXml(post.getSlug())).append("</link>\n");
            xml.append("    <guid>").append(escapeXml(frontendUrl)).append("/blog/").append(escapeXml(post.getSlug())).append("</guid>\n");
            if (post.getSummary() != null) {
                xml.append("    <description>").append(escapeXml(post.getSummary())).append("</description>\n");
            }
            if (post.getCreatedAt() != null) {
                xml.append("    <pubDate>").append(post.getCreatedAt().format(rfc822)).append("</pubDate>\n");
            }
            xml.append("  </item>\n");
        }

        xml.append("</channel>\n");
        xml.append("</rss>");

        return ResponseEntity.ok(xml.toString());
    }

    private String escapeXml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                     .replace("<", "&lt;")
                     .replace(">", "&gt;")
                     .replace("\"", "&quot;")
                     .replace("'", "&apos;");
    }
}
