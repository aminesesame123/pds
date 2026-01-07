import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomAuthService } from '../auth/custom-auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userProfile: any | null = null;
  userRoles: string[] = [];

  constructor(private authService: CustomAuthService) { }

  ngOnInit() {
    // Force refresh profile potentially
    this.userProfile = this.authService.getProfile();
    this.userRoles = this.userProfile?.realm_access?.roles || [];
  }
}
