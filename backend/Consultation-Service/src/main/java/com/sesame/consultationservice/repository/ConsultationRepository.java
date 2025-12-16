package com.sesame.consultationservice.repository;

import com.sesame.consultationservice.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByDossierMedicalId(Long dossierMedicalId);

    List<Consultation> findByMedecinId(Long medecinId);
}
