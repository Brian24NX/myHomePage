package com.brian.website.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CvController {

    @Value("${app.cv.storage-dir:./cv-uploads}")
    private String storageDir;

    private static final String CV_FILENAME = "brian-cv.pdf";

    @PostMapping("/admin/cv/upload")
    public ResponseEntity<?> uploadCv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PDF files are allowed"));
        }

        try {
            Path dir = Paths.get(storageDir);
            Files.createDirectories(dir);
            Path target = dir.resolve(CV_FILENAME);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            long size = file.getSize();
            return ResponseEntity.ok(Map.of(
                "message", "CV uploaded successfully",
                "fileName", file.getOriginalFilename(),
                "size", size
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload CV"));
        }
    }

    @GetMapping("/cv/download")
    public ResponseEntity<?> downloadCv() {
        try {
            Path filePath = Paths.get(storageDir).resolve(CV_FILENAME);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            Resource resource = new UrlResource(filePath.toUri());
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"Brian_Zhou_CV.pdf\"")
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to retrieve CV"));
        }
    }

    @GetMapping("/cv/info")
    public ResponseEntity<?> getCvInfo() {
        try {
            Path filePath = Paths.get(storageDir).resolve(CV_FILENAME);
            if (!Files.exists(filePath)) {
                return ResponseEntity.ok(Map.of("exists", false));
            }
            long size = Files.size(filePath);
            long lastModified = Files.getLastModifiedTime(filePath).toMillis();
            return ResponseEntity.ok(Map.of(
                "exists", true,
                "size", size,
                "lastModified", lastModified,
                "fileName", "Brian_Zhou_CV.pdf"
            ));
        } catch (IOException e) {
            return ResponseEntity.ok(Map.of("exists", false));
        }
    }
}
