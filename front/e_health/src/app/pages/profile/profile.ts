import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAuthService } from '../../auth/custom-auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  userData: any = {};
  userInitials: string = '';

  constructor(private authService: CustomAuthService) { }

  ngOnInit() {
    const profile = this.authService.getProfile();
    console.log('Profile Data:', profile);

    if (profile) {
      this.userData = {
        username: profile.preferred_username,
        email: profile.email,
        firstName: profile.given_name || 'Utilisateur',
        lastName: profile.family_name || '',
        role: profile.realm_access?.roles?.find((r: string) => !['default-roles-medinsightrealm', 'offline_access', 'uma_authorization'].includes(r)) || 'UTILISATEUR'
      };

      this.userInitials = (this.userData.firstName[0] || '') + (this.userData.lastName[0] || '');
    }
  }
}
