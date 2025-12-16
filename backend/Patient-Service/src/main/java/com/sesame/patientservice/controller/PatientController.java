package com.sesame.patientservice.controller;

import com.sesame.patientservice.model.DossierMedical;
import com.sesame.patientservice.model.Patient;
import com.sesame.patientservice.repository.DossierMedicalRepository;
import com.sesame.patientservice.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository patientRepository;
    private final DossierMedicalRepository dossierMedicalRepository;

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        // Create DossierMedical automatically
        DossierMedical dm = new DossierMedical();
        dm.setStatut("ACTIF");
        dm.setPatient(patient);
        patient.setDossierMedical(dm);
        return patientRepository.save(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setNom(patientDetails.getNom());
                    patient.setPrenom(patientDetails.getPrenom());
                    patient.setAdresse(patientDetails.getAdresse());
                    patient.setTelephone(patientDetails.getTelephone());
                    patient.setDateNaissance(patientDetails.getDateNaissance());
                    return ResponseEntity.ok(patientRepository.save(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/dossier")
    public ResponseEntity<DossierMedical> getDossierMedical(@PathVariable Long id) {
        return dossierMedicalRepository.findByPatientId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
