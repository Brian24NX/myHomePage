package com.brian.website.repository;

import com.brian.website.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByReadFalseOrderByCreatedAtDesc();
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
}
