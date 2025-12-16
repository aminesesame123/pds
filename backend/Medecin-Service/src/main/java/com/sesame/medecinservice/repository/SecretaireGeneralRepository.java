package com.sesame.medecinservice.repository;

import com.sesame.medecinservice.model.SecretaireGeneral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecretaireGeneralRepository extends JpaRepository<SecretaireGeneral, Long> {
    Optional<SecretaireGeneral> findByEmail(String email);
}
