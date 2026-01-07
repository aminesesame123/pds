import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  standalone: false
})
export class AdminLayout {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
