package com.sesame.medecinservice.controller;

import com.sesame.medecinservice.model.Medecin;
import com.sesame.medecinservice.repository.MedecinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medecins")
@RequiredArgsConstructor
public class MedecinController {

    private final MedecinRepository repository;
    private final com.sesame.medecinservice.service.KeycloakService keycloakService;

    @GetMapping
    public List<Medecin> getAllMedecins() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medecin> getMedecinById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Medecin createMedecin(@RequestBody Medecin medecin) {
        return repository.save(medecin);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody com.sesame.medecinservice.dto.RegisterRequest request) {
        try {
            // 1. Create User in Keycloak
            keycloakService.createUser(
                    request.getUsername() != null ? request.getUsername() : request.getEmail(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getPrenom(),
                    request.getNom(),
                    false); // Disabled by default, needs admin approval.

            // 2. Create Medecin in DB
            Medecin medecin = new Medecin();
            medecin.setNom(request.getNom());
            medecin.setPrenom(request.getPrenom());
            medecin.setEmail(request.getEmail());
            medecin.setTelephone(request.getTelephone());
            medecin.setSpecialite(request.getSpecialite());
            medecin.setGrade(request.getGrade());

            Medecin savedMedecin = repository.save(medecin);
            return ResponseEntity.ok(savedMedecin);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedecin(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
