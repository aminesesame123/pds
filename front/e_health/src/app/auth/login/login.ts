import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomAuthService } from '../custom-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: CustomAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        const profile = this.authService.getProfile();
        const roles = profile?.realm_access?.roles || [];

        if (roles.includes('ADMIN')) {
          this.router.navigate(['/patients']);
        } else if (roles.includes('RESPONSABLE_SECURITE')) {
          this.router.navigate(['/security-dashboard']); // TODO: Create this dashboard
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.error = 'Identifiants invalides ou compte en attente de validation.';
        this.loading = false;
      }
    });
  }
}
