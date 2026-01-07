import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAuthService } from '../../auth/custom-auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  username: string = '';
  role: string = '';

  constructor(private authService: CustomAuthService) { }

  ngOnInit() {
    const profile = this.authService.getProfile();
    if (profile) {
      this.username = profile.preferred_username || 'Utilisateur';
      // Simplified role display
      const roles = profile.realm_access?.roles || [];
      this.role = roles.includes('ADMIN') ? 'Administrateur' :
        roles.includes('MEDECIN') ? 'Médecin' : 'Patient';
    }
  }

  logout() {
    this.authService.logout();
  }
}
