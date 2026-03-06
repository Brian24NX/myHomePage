package com.brian.website;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication(exclude = { org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration.class })
public class WebsiteApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebsiteApplication.class, args);
    }
}
