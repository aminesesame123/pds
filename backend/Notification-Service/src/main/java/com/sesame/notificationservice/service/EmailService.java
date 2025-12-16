package com.sesame.notificationservice.service;

import com.sesame.notificationservice.model.Notification;
import com.sesame.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final NotificationRepository repository;

    public Notification sendEmail(String to, String subject, String body) {
        Notification notification = new Notification();
        notification.setDestinataire(to);
        notification.setSujet(subject);
        notification.setMessage(body);
        notification.setDateEnvoi(LocalDateTime.now());

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            javaMailSender.send(message);
            notification.setStatut("ENVOYE");
        } catch (Exception e) {
            notification.setStatut("ECHEC: " + e.getMessage());
        }

        return repository.save(notification);
    }
}
