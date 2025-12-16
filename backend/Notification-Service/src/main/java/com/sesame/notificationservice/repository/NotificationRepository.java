package com.sesame.notificationservice.repository;

import com.sesame.notificationservice.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByDestinataire(String destinataire);
}
