package com.sesame.patientservice.controller;

import com.sesame.patientservice.model.DossierMedical;
import com.sesame.patientservice.repository.DossierMedicalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dossiers")
@RequiredArgsConstructor
public class DossierMedicalController {

    private final DossierMedicalRepository repository;

    @GetMapping
    public List<DossierMedical> getAllDossiers() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DossierMedical> getDossierById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DossierMedical> updateDossier(@PathVariable Long id, @RequestBody DossierMedical details) {
        return repository.findById(id)
                .map(d -> {
                    d.setStatut(details.getStatut());
                    // Update other fields as necessary
                    return ResponseEntity.ok(repository.save(d));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDossier(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
