import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private keycloak: KeycloakService) { }

    register(user: any): Observable<any> {
        let servicePrefix = '/auth-service';
        if (user.role === 'PATIENT') {
            servicePrefix = '/patient-service/api/patients';
        } else if (user.role === 'MEDECIN') {
            servicePrefix = '/medecin-service/api/medecins';
        } else {
            servicePrefix = '/auth-service/api/auth';
        }

        const url = `${environment.apiUrl}${servicePrefix}/register`;
        return this.http.post(url, user);
    }

    logout() {
        this.keycloak.logout();
    }

    isLoggedIn(): boolean {
        // KeycloakService.isLoggedIn() is synchronous in keycloak-angular
        return this.keycloak.isLoggedIn();
    }

    getUserProfile() {
        return this.keycloak.loadUserProfile();
    }
}
