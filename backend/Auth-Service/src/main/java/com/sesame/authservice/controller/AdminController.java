package com.sesame.authservice.controller;

import com.sesame.authservice.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final KeycloakService keycloakService;

    @GetMapping("/pending-users")
    public ResponseEntity<List<Map>> getPendingUsers() {
        try {
            return ResponseEntity.ok(keycloakService.getPendingUsers());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/approve-user/{userId}")
    public ResponseEntity<?> approveUser(@PathVariable String userId) {
        try {
            keycloakService.approveUser(userId);
            return ResponseEntity.ok(Map.of("message", "User approved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Approval failed: " + e.getMessage());
        }
    }
}
