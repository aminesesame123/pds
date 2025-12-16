package com.sesame.rendezvousservice.repository;

import com.sesame.rendezvousservice.model.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByMedecinId(Long medecinId);

    List<RendezVous> findByPatientId(Long patientId);
}
