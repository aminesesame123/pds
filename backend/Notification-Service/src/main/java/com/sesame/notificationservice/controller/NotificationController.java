package com.sesame.notificationservice.controller;

import com.sesame.notificationservice.model.Notification;
import com.sesame.notificationservice.repository.NotificationRepository;
import com.sesame.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repository;
    private final EmailService emailService;

    @PostMapping("/send")
    public Notification sendNotification(@RequestParam String to, @RequestParam String subject,
            @RequestBody String body) {
        return emailService.sendEmail(to, subject, body);
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
