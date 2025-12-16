package com.sesame.analyticsservice.repository;

import com.sesame.analyticsservice.model.AnalysePredictive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysePredictiveRepository extends JpaRepository<AnalysePredictive, Long> {
    List<AnalysePredictive> findByDossierMedicalId(Long dossierMedicalId);
}
