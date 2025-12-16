# Documentation des API MedInsight

Ce document liste l'ensemble des endpoints disponibles sur la plateforme MedInsight.
Tous les services sont accessibles via la Gateway sur le port **8080**.

URL de base : `http://localhost:8080`

## 1. Service Patient
**Base URL** : `/api/patients`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Récupérer la liste de tous les patients. |
| `GET` | `/{id}` | Récupérer un patient par son ID. |
| `POST` | `/` | Créer un nouveau patient (crée aussi un dossier vide). |
| `PUT` | `/{id}` | Mettre à jour les informations d'un patient. |
| `DELETE` | `/{id}` | Supprimer un patient. |

### Dossiers Médicaux
**Base URL** : `/api/dossiers`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Lister tous les dossiers. |
| `GET` | `/{id}` | Détail d'un dossier. |
| `PUT` | `/{id}` | Mettre à jour un dossier (statut, etc.). |
| `DELETE` | `/{id}` | Supprimer un dossier. |

## 2. Service Médecin
**Base URL** : `/api/medecins`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Récupérer la liste de tous les médecins. |
| `GET` | `/{id}` | Récupérer un médecin par son ID. |
| `POST` | `/` | Créer un nouveau médecin. |
| `DELETE` | `/{id}` | Supprimer un médecin. |

### Secrétaires
**Base URL** : `/api/secretaires`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Liste des secrétaires. |
| `POST` | `/` | Ajouter un(e) secrétaire. |
| `DELETE` | `/{id}` | Supprimer un(e) secrétaire. |

## 3. Service Rendez-Vous

## 3. Service Rendez-Vous
**Base URL** : `/api/rendezvous`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Récupérer tous les rendez-vous. |
| `GET` | `/{id}` | Récupérer un rendez-vous par ID. |
| `GET` | `/medecin/{medecinId}` | Liste des RDV d'un médecin. |
| `GET` | `/patient/{patientId}` | Liste des RDV d'un patient. |
| `POST` | `/` | Créer un nouveau rendez-vous. |
| `PUT` | `/{id}/statut` | Mettre à jour le statut (ex: "CONFIRME", "ANNULE"). |
| `DELETE` | `/{id}` | Supprimer un rendez-vous. |

## 4. Service Consultation
**Base URL** : `/api/consultations`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Liste de toutes les consultations. |
| `GET` | `/{id}` | Détail d'une consultation. |
| `GET` | `/dossier/{dossierID}` | Consultations liées à un dossier médical. |
| `POST` | `/` | Créer une consultation. |
| `DELETE` | `/{id}` | Supprimer une consultation. |

## 5. Service Analytics (Prédiction)
**Base URL** : `/api/analytics`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Toutes les analyses prédictives. |
| `GET` | `/dossier/{dossierID}` | Analyses d'un dossier spécifque. |
| `POST` | `/` | Lancer une nouvelle analyse prédictive. |
| `DELETE` | `/{id}` | Supprimer un rapport d'analyse. |

## 6. Service Audit
**Base URL** : `/api/audit`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Voir tous les logs d'audit. |
| `GET` | `/user/{username}` | Logs d'un utilisateur spécifique. |
| `POST` | `/` | Créer une entrée de log (Interne). |
| `DELETE` | `/{id}` | Supprimer un log. |

## 7. Service Notification
**Base URL** : `/api/notifications`

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/send?to=X&subject=Y` | Envoyer un email (Body = contenu). |
| `GET` | `/` | Historique des notifications. |
| `GET` | `/{id}` | Détail d'une notification. |
| `DELETE` | `/{id}` | Supprimer une notification. |

## Documentation Swagger (OpenAPI)
L'interface Swagger agrégée est disponible ici :
http://localhost:8080/webjars/swagger-ui/index.html

Vous pouvez tester les API directement depuis cette interface.
