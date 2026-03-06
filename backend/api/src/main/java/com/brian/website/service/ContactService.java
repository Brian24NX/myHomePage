package com.brian.website.service;

import com.brian.website.dto.ContactRequest;
import com.brian.website.model.ContactMessage;
import com.brian.website.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
public class ContactService {

    private final ContactMessageRepository messageRepository;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${app.mail.to}")
    private String recipientEmail;

    @Value("${app.resend.api-key:}")
    private String resendApiKey;

    public ContactService(ContactMessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public ContactMessage saveMessage(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());

        ContactMessage saved = messageRepository.save(message);

        if (resendApiKey != null && !resendApiKey.isEmpty()) {
            try {
                sendEmailViaResend(request);
            } catch (Exception e) {
                System.err.println("Email notification failed: " + e.getMessage());
            }
        }

        return saved;
    }

    public List<ContactMessage> getAllMessages() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<ContactMessage> getUnreadMessages() {
        return messageRepository.findByReadFalseOrderByCreatedAtDesc();
    }

    public ContactMessage markAsRead(Long id) {
        ContactMessage msg = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        msg.setRead(true);
        return messageRepository.save(msg);
    }

    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }

    private void sendEmailViaResend(ContactRequest request) throws Exception {
        String subject = "Website Contact: " + (request.getSubject() != null ? request.getSubject() : "New Message");
        String body = String.format(
                "New contact message from your website:<br><br>" +
                "<b>From:</b> %s (%s)<br><br>" +
                "<b>Message:</b><br>%s",
                escapeHtml(request.getName()),
                escapeHtml(request.getEmail()),
                escapeHtml(request.getMessage()).replace("\n", "<br>"));

        String json = String.format(
                "{\"from\":\"Website <onboarding@resend.dev>\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":\"%s\",\"reply_to\":\"%s\"}",
                recipientEmail,
                escapeJson(subject),
                escapeJson(body),
                escapeJson(request.getEmail()));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 400) {
            throw new RuntimeException("Resend API error: " + response.body());
        }
    }

    private String escapeJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }

    private String escapeHtml(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
