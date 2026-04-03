package com.brian.website.repository;

import com.brian.website.model.CvDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CvDocumentRepository extends JpaRepository<CvDocument, Long> {

    /** Fetch only metadata — never touches the heavy `data` blob column. */
    @Query("SELECT c.id AS id, c.fileName AS fileName, c.fileSize AS fileSize, c.updatedAt AS updatedAt FROM CvDocument c ORDER BY c.id ASC LIMIT 1")
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
