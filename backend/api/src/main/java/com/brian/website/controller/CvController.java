package com.brian.website.controller;

import com.brian.website.model.CvDocument;
import com.brian.website.repository.CvDocumentRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZoneOffset;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CvController {

    private final CvDocumentRepository cvRepo;

    public CvController(CvDocumentRepository cvRepo) {
        this.cvRepo = cvRepo;
    }

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
            // Keep only one CV row — reuse existing or create new
            CvDocument doc = cvRepo.findFirstByOrderByIdAsc().orElse(new CvDocument());
            doc.setFileName(file.getOriginalFilename());
            doc.setFileSize(file.getSize());
            doc.setData(file.getBytes());
            cvRepo.save(doc);

            return ResponseEntity.ok(Map.of(
                "message", "CV uploaded successfully",
                "fileName", file.getOriginalFilename(),
                "size", file.getSize()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload CV"));
        }
    }

    @GetMapping("/cv/download")
    public ResponseEntity<?> downloadCv() {
        return cvRepo.findFirstByOrderByIdAsc()
            .map(doc -> ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"Brian_Zhou_CV.pdf\"")
                .body(doc.getData()))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cv/info")
    public ResponseEntity<?> getCvInfo() {
        return cvRepo.findFirstMetadata()
            .map(meta -> ResponseEntity.ok(Map.of(
                "exists", true,
                "size", meta.getFileSize(),
                "lastModified", meta.getUpdatedAt().toInstant(ZoneOffset.UTC).toEpochMilli(),
                "fileName", "Brian_Zhou_CV.pdf"
            )))
            .orElse(ResponseEntity.ok(Map.of("exists", false)));
    }
}
