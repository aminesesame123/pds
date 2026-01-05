import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAuthService } from '../auth/custom-auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="card">
        <h1>Bienvenue, {{ userProfile?.preferred_username }}</h1>
        <p>Email: {{ userProfile?.email }}</p>
        <p>Nom: {{ userProfile?.given_name }} {{ userProfile?.family_name }}</p>
        
        <div class="roles-section">
          <h3>Vos Rôles:</h3>
          <ul>
            <li *ngFor="let role of userRoles">{{ role }}</li>
          </ul>
        </div>

        <button (click)="logout()" class="btn-logout">Déconnexion</button>
      </div>
    </div>
  `,
  styles: [`
    /* Same styles as before, stripped landing part */
    .container { display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f4f9; font-family: 'Segoe UI', sans-serif; }
    .card { background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 400px; text-align: center; }
    h1 { color: #2c3e50; margin-bottom: 0.5rem; font-size: 2rem; }
    p { color: #7f8c8d; margin: 0.5rem 0; }
    .roles-section { margin-top: 1.5rem; text-align: left; }
    ul { list-style-type: none; padding: 0; }
    li { background: #e0f7fa; color: #006064; padding: 0.5rem; margin: 0.25rem 0; border-radius: 4px; font-size: 0.9rem; }
    .btn-logout { background-color: #e74c3c; color: white; margin-top: 2rem; width: 100%; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-logout:hover { background-color: #c0392b; }
  `]
})
export class HomeComponent implements OnInit {
  userProfile: any | null = null;
  userRoles: string[] = [];

  constructor(private authService: CustomAuthService) { }

  ngOnInit() {
    this.userProfile = this.authService.getProfile();
    // basic role extraction if available in token
    this.userRoles = this.userProfile?.realm_access?.roles || [];
  }

  logout() {
    this.authService.logout();
  }
}
