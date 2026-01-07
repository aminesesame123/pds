import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: false
})
export class RegisterComponent {
  user: any = {
    role: 'PATIENT',
    nom: '',
    prenom: '',
    email: '',
    password: '',
    adresse: '',
    telephone: '',
    specialite: '',
    dateNaissance: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    console.log('Registering user:', this.user);
    this.authService.register(this.user).subscribe({
      next: (res) => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Registration failed', err);
        alert('Registration failed: ' + (err.error?.message || err.message));
      }
    });
  }
}
