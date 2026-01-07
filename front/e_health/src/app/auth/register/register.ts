import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomAuthService } from '../custom-auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: CustomAuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      role: ['PATIENT', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telephone: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      adresse: ['', Validators.required],
      specialite: [''],
      grade: ['']
    });
  }

  ngOnInit(): void {
    this.onRoleChange();
  }

  onRoleChange() {
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      const specControl = this.registerForm.get('specialite');
      const gradeControl = this.registerForm.get('grade');

      if (role === 'MEDECIN') {
        specControl?.setValidators([Validators.required]);
        gradeControl?.setValidators([Validators.required]);
      } else {
        specControl?.clearValidators();
        gradeControl?.clearValidators();
      }
      specControl?.updateValueAndValidity();
      gradeControl?.updateValueAndValidity();
    });
  }

  setRole(role: string) {
    this.registerForm.patchValue({ role });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = this.registerForm.value;

    // We send the whole form data, expecting the backend Auth Service 
    // to map what it needs (username/email/password/role) 
    // and ideally propagate other profile info if configured.
    // NOTE: Auth Service might ignore telephone/adresse/dateNaissance unless updated.

    this.authService.register(formData).subscribe({
      next: (res) => {
        this.success = 'Inscription réussie ! Votre compte a été créé. Vous pouvez maintenant vous connecter.';
        this.loading = false;
        // Redirect to login after a short delay to let user read success message
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        console.error('Registration error:', err);
        if (err.status === 409) {
          this.error = 'Un compte avec cet email existe déjà.';
        } else {
          this.error = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
        }
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
