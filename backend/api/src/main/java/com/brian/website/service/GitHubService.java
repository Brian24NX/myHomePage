package com.brian.website.service;

import com.brian.website.dto.GitHubRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.logging.Logger;

@Service
public class GitHubService {

    private static final Logger log = Logger.getLogger(GitHubService.class.getName());

    @Value("${app.github.username}")
    private String githubUsername;

    @Value("${app.github.token}")
    private String githubToken;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Cacheable("github-repos")
    public List<GitHubRepo> getPublicRepos() {
        try {
            List<GitHubRepo> result = new ArrayList<>();

            for (JsonNode repo : fetchAllRepos()) {
                if (repo.has("fork") && repo.get("fork").asBoolean()) continue;
                result.add(mapRepo(repo));
            }

            // Sort by updated_at descending so newest activity comes first
            result.sort((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()));
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch GitHub repos", e);
        }
    }

    @Cacheable("github-stats")
    public Map<String, Object> getStats() {
        try {
            List<JsonNode> repos = fetchAllRepos();
            JsonNode user = fetchGitHub("/users/" + githubUsername);

            int totalStars = 0;
            int totalForks = 0;
            int totalRepos = 0;
            Map<String, Integer> languages = new LinkedHashMap<>();
            List<Map<String, Object>> activityData = new ArrayList<>();

            for (JsonNode repo : repos) {
                if (repo.has("fork") && repo.get("fork").asBoolean()) continue;
                totalRepos++;
                totalStars += repo.get("stargazers_count").asInt();
                totalForks += repo.get("forks_count").asInt();

                String lang = repo.has("language") && !repo.get("language").isNull()
                        ? repo.get("language").asText() : null;
                if (lang != null) {
                    languages.merge(lang, 1, Integer::sum);
                }

                // Activity data: repo size as a proxy for contribution
                String updatedAt = repo.get("updated_at").asText();
                String date = updatedAt.substring(0, 7); // YYYY-MM
                Map<String, Object> activity = new HashMap<>();
                activity.put("date", date);
                activity.put("repo", repo.get("name").asText());
                activity.put("size", repo.get("size").asInt());
                activityData.add(activity);
            }

            // Sort languages by count descending
            List<Map<String, Object>> languageBreakdown = new ArrayList<>();
            final int repoCount = totalRepos;
            languages.entrySet().stream()
                    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                    .forEach(entry -> {
                        Map<String, Object> langData = new HashMap<>();
                        langData.put("name", entry.getKey());
                        langData.put("count", entry.getValue());
                        langData.put("percentage", Math.round(entry.getValue() * 100.0 / repoCount));
                        languageBreakdown.add(langData);
                    });

            // Aggregate activity by month
            Map<String, Integer> monthlyActivity = new TreeMap<>();
            for (Map<String, Object> a : activityData) {
                String date = (String) a.get("date");
                monthlyActivity.merge(date, 1, Integer::sum);
            }
            List<Map<String, Object>> activityChart = new ArrayList<>();
            monthlyActivity.forEach((date, count) -> {
                Map<String, Object> point = new HashMap<>();
                point.put("month", date);
                point.put("repos", count);
                activityChart.add(point);
            });

            Map<String, Object> stats = new LinkedHashMap<>();
            stats.put("totalRepos", totalRepos);
            stats.put("totalStars", totalStars);
            stats.put("totalForks", totalForks);
            stats.put("followers", user.get("followers").asInt());
            stats.put("following", user.get("following").asInt());
            stats.put("publicGists", user.get("public_gists").asInt());
            stats.put("languages", languageBreakdown);
            stats.put("activity", activityChart);

            return stats;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch GitHub stats", e);
        }
    }

    /**
     * Evict all GitHub caches every 10 minutes so data stays reasonably fresh.
     */
    @Scheduled(fixedRate = 600_000)
    @CacheEvict(value = {"github-repos", "github-stats"}, allEntries = true)
    public void refreshCache() {
        log.info("Cleared GitHub caches — next request will fetch fresh data");
    }

    private List<JsonNode> fetchAllRepos() throws Exception {
        List<JsonNode> allRepos = new ArrayList<>();
        int page = 1;

        while (true) {
            JsonNode repos = fetchGitHub("/users/" + githubUsername +
                    "/repos?per_page=100&type=public&page=" + page);

            if (!repos.isArray() || repos.size() == 0) break;

            for (JsonNode repo : repos) {
                allRepos.add(repo);
            }

            if (repos.size() < 100) break;
            page++;
        }

        return allRepos;
    }

    private JsonNode fetchGitHub(String path) throws Exception {
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create("https://api.github.com" + path))
                .header("Accept", "application/vnd.github.v3+json");

        if (githubToken != null && !githubToken.isEmpty()) {
            requestBuilder.header("Authorization", "token " + githubToken);
        }

        HttpResponse<String> response = httpClient.send(
                requestBuilder.build(), HttpResponse.BodyHandlers.ofString());
        return objectMapper.readTree(response.body());
    }

    private GitHubRepo mapRepo(JsonNode repo) {
        GitHubRepo dto = new GitHubRepo();
        dto.setName(repo.get("name").asText());
        dto.setDescription(repo.has("description") && !repo.get("description").isNull()
                ? repo.get("description").asText() : "");
        dto.setHtmlUrl(repo.get("html_url").asText());
        dto.setLanguage(repo.has("language") && !repo.get("language").isNull()
                ? repo.get("language").asText() : "");
        dto.setStars(repo.get("stargazers_count").asInt());
        dto.setForks(repo.get("forks_count").asInt());
        dto.setUpdatedAt(repo.get("updated_at").asText());
        dto.setHomepage(repo.has("homepage") && !repo.get("homepage").isNull()
                ? repo.get("homepage").asText() : "");
        return dto;
    }
}
