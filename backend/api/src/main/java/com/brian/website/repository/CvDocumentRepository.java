package com.brian.website.repository;

import com.brian.website.model.CvDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CvDocumentRepository extends JpaRepository<CvDocument, Long> {
}
