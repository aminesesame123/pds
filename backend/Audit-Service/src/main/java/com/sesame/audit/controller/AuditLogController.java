package com.sesame.audit.controller;

import com.sesame.audit.model.AuditLog;
import com.sesame.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository repository;

    @PostMapping
    public ResponseEntity<AuditLog> createLog(@RequestBody AuditLog log) {
        return ResponseEntity.ok(repository.save(log));
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<AuditLog>> getLogsByUser(@PathVariable String username) {
        return ResponseEntity.ok(repository.findByUtilisateur(username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
