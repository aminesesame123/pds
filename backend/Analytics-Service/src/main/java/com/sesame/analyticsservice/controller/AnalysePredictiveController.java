package com.sesame.analyticsservice.controller;

import com.sesame.analyticsservice.model.AnalysePredictive;
import com.sesame.analyticsservice.repository.AnalysePredictiveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalysePredictiveController {

    private final AnalysePredictiveRepository repository;

    @GetMapping
    public List<AnalysePredictive> getAllAnalyses() {
        return repository.findAll();
    }

    @GetMapping("/dossier/{dossierId}")
    public List<AnalysePredictive> getAnalysesByDossier(@PathVariable Long dossierId) {
        return repository.findByDossierMedicalId(dossierId);
    }

    @PostMapping
    public AnalysePredictive runAnalysis(@RequestBody AnalysePredictive analysis) {
        // Mock prediction logic
        if (analysis.getDateExecution() == null) {
            analysis.setDateExecution(java.time.LocalDateTime.now());
        }
        if (analysis.getResultat() == null) {
            analysis.setResultat("Prediction: High Risk (Mock)");
        }
        return repository.save(analysis);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
