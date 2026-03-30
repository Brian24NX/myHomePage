package com.brian.website;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = { org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration.class })
@EnableCaching
@EnableScheduling
public class WebsiteApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebsiteApplication.class, args);
    }
}
