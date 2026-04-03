package com.brian.website.repository;

import com.brian.website.model.CvDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CvDocumentRepository extends JpaRepository<CvDocument, Long> {

    /** Fetch only metadata — never touches the heavy `data` blob column. */
    @Query(value = "SELECT file_name AS fileName, file_size AS fileSize, updated_at AS updatedAt FROM cv_documents ORDER BY id ASC LIMIT 1", nativeQuery = true)
    Optional<CvMetadata> findFirstMetadata();

    /** Fetch the full entity (including PDF bytes) — use only for download. */
    Optional<CvDocument> findFirstByOrderByIdAsc();

    /** Projection interface for metadata-only queries. */
    interface CvMetadata {
        String getFileName();
        long getFileSize();
        java.time.LocalDateTime getUpdatedAt();
    }
}
