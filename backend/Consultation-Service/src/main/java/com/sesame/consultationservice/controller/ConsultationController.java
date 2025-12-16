package com.sesame.consultationservice.controller;

import com.sesame.consultationservice.model.Consultation;
import com.sesame.consultationservice.repository.ConsultationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationRepository repository;

    @GetMapping
    public List<Consultation> getAllConsultations() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dossier/{dossierMedicalId}")
    public List<Consultation> getConsultationsByDossier(@PathVariable Long dossierMedicalId) {
        return repository.findByDossierMedicalId(dossierMedicalId);
    }

    @PostMapping
    public Consultation createConsultation(@RequestBody Consultation consultation) {
        return repository.save(consultation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
