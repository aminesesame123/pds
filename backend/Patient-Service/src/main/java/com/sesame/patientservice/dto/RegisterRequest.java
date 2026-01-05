package com.sesame.patientservice.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String nom;
    private String prenom;
    private String adresse;
    private String telephone;
    private LocalDate dateNaissance;
}
