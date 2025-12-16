import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container" *ngIf="isLoggedIn">
      <div class="card">
        <h1>Bienvenue, {{ userProfile?.username }}</h1>
        <p>Email: {{ userProfile?.email }}</p>
        <p>Nom: {{ userProfile?.firstName }} {{ userProfile?.lastName }}</p>
        
        <div class="roles-section">
          <h3>Vos Rôles (Realm):</h3>
          <ul>
            <li *ngFor="let role of userRoles">{{ role }}</li>
          </ul>
        </div>

        <button (click)="logout()" class="btn-logout">Déconnexion</button>
      </div>
    </div>
    <div *ngIf="!isLoggedIn">
      <p>Chargement...</p>
    </div>
  `,
    styles: [`
    .container { display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f4f9; font-family: 'Segoe UI', sans-serif; }
    .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 400px; text-align: center; }
    h1 { color: #2c3e50; margin-bottom: 0.5rem; }
    p { color: #7f8c8d; margin: 0.5rem 0; }
    .roles-section { margin-top: 1.5rem; text-align: left; }
    ul { list-style-type: none; padding: 0; }
    li { background: #e0f7fa; color: #006064; padding: 0.5rem; margin: 0.25rem 0; border-radius: 4px; font-size: 0.9rem; }
    .btn-logout { background-color: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-top: 2rem; transition: background 0.3s; }
    .btn-logout:hover { background-color: #c0392b; }
  `]
})
export class HomeComponent implements OnInit {
    isLoggedIn = false;
    userProfile: any | null = null;
    userRoles: string[] = [];

    constructor(private keycloak: KeycloakService) { }

    async ngOnInit() {
        this.isLoggedIn = await this.keycloak.isLoggedIn();
        if (this.isLoggedIn) {
            this.userProfile = await this.keycloak.loadUserProfile();
            this.userRoles = this.keycloak.getUserRoles();
        }
    }

    logout() {
        this.keycloak.logout();
    }
}
