package com.brian.website.controller;

import com.brian.website.dto.GitHubRepo;
import com.brian.website.service.GitHubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/github")
public class GitHubController {

    private final GitHubService gitHubService;

    public GitHubController(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @GetMapping("/repos")
    public ResponseEntity<List<GitHubRepo>> getRepos() {
        return ResponseEntity.ok(gitHubService.getPublicRepos());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(gitHubService.getStats());
    }
}
