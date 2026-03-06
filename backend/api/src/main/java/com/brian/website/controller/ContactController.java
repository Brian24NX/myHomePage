package com.brian.website.controller;

import com.brian.website.dto.ContactRequest;
import com.brian.website.model.ContactMessage;
import com.brian.website.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<?> submitContact(@Valid @RequestBody ContactRequest request) {
        contactService.saveMessage(request);
        return ResponseEntity.ok(Map.of("message", "Thanks! Your message has been sent."));
    }
}
