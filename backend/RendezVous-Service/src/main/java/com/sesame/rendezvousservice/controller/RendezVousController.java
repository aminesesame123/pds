package com.sesame.rendezvousservice.controller;

import com.sesame.rendezvousservice.model.RendezVous;
import com.sesame.rendezvousservice.repository.RendezVousRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rendezvous")
@RequiredArgsConstructor
public class RendezVousController {

    private final RendezVousRepository repository;

    @GetMapping
    public List<RendezVous> getAllRendezVous() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RendezVous> getRendezVousById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/medecin/{medecinId}")
    public List<RendezVous> getRendezVousByMedecin(@PathVariable Long medecinId) {
        return repository.findByMedecinId(medecinId);
    }

    @GetMapping("/patient/{patientId}")
    public List<RendezVous> getRendezVousByPatient(@PathVariable Long patientId) {
        return repository.findByPatientId(patientId);
    }

    @PostMapping
    public RendezVous createRendezVous(@RequestBody RendezVous rendezVous) {
        if (rendezVous.getStatut() == null) {
            rendezVous.setStatut("PLANIFIE");
        }
        return repository.save(rendezVous);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<RendezVous> updateStatut(@PathVariable Long id, @RequestParam String statut) {
        return repository.findById(id)
                .map(rdv -> {
                    rdv.setStatut(statut);
                    return ResponseEntity.ok(repository.save(rdv));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
