package com.sesame.authservice.controller;

import com.sesame.authservice.service.KeycloakService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegistrationController {

    private final KeycloakService keycloakService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        try {
            // New accounts are disabled by default as per requirement
            String userId = keycloakService.createUser(
                    request.getEmail(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getPrenom(),
                    request.getNom(),
                    false // disabled by default
            );

            // Assign the requested role
            keycloakService.assignRole(userId, request.getRole());

            return ResponseEntity.ok(new RegistrationResponse("Account created. Waiting for admin approval.", userId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @Data
    public static class RegistrationRequest {
        private String nom;
        private String prenom;
        private String email;
        private String password;
        private String role; // PATIENT, MEDECIN, SECRETAIRE
    }

    @Data
    @RequiredArgsConstructor
    public static class RegistrationResponse {
        private final String message;
        private final String userId;
    }
}
