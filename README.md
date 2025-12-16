# MedInsight - E-Health Platform

## Overview
MedInsight is a microservices-based e-health platform designed to manage patients, medical records, consultations, and appointments. It uses Spring Boot for the backend, Keycloak for authentication, and Docker for containerization.

## Architecture
The system consists of the following microservices:
- **Discovery Service** (Eureka): Service registration and discovery.
- **Gateway Service** (Spring Cloud Gateway): Entry point, routing, and load balancing.
- **Auth Service** (Keycloak): Identity and Access Management (OIDC/OAuth2).
- **Supervision Service** (Spring Boot Admin): Monitoring and health checks.
- **Patient Service**: Manages Patient profiles and Medical Records (`DossierMedical`).
- **Medecin Service**: Manages Practitioners (`Medecin`, `SecretaireGeneral`).
- **RendezVous Service**: Manages Appointments.
- **Consultation Service**: Manages Consultations and Reports.
- **Analytics Service**: Predictive analysis (Mock AI).
- **Audit Service**: Logs user actions.

## Prerequisites
- Java 17
- Maven
- Docker & Docker Compose
- Node.js (for Frontend)

## Getting Started

### 1. Infrastructure Setup
Start the infrastructure (Postgres, Keycloak, etc.) and services:

```bash
docker-compose up -d --build
```

### 2. Keycloak Configuration
Run the initialization script to set up the Realm, Clients, and Roles:

```bash
cd infra/keycloak
./init-keycloak.sh
```
*Wait for Keycloak (port 8090) to be fully up before running this script.*

### 3. Access Points
- **Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Spring Boot Admin**: http://localhost:9090
- **Keycloak**: http://localhost:8090 (admin/admin)
- **Frontend**: http://localhost:5173

## Service Endpoints (via Gateway)
- **Patients**: `/api/patients`
- **Medecins**: `/api/medecins`
- **RendezVous**: `/api/rendezvous`
- **Consultations**: `/api/consultations`
- **Analytics**: `/api/analytics`
- **Audit**: `/api/audit`

## Swagger/OpenAPI
Aggregate Swagger UI is available at `http://localhost:8080/webjars/swagger-ui/index.html` (if configured) or individual service endpoints.
