package com.sesame.medecinservice.controller;

import com.sesame.medecinservice.model.SecretaireGeneral;
import com.sesame.medecinservice.repository.SecretaireGeneralRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secretaires")
@RequiredArgsConstructor
public class SecretaireController {

    private final SecretaireGeneralRepository repository;

    @GetMapping
    public List<SecretaireGeneral> getAllSecretaires() {
        return repository.findAll();
    }

    @PostMapping
    public SecretaireGeneral createSecretaire(@RequestBody SecretaireGeneral secretaire) {
        return repository.save(secretaire);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSecretaire(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
