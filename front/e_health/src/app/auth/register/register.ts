import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { MedecinService } from '../../services/medecin.service';

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
    private patientService: PatientService,
    private medecinService: MedecinService,
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
    const role = formData.role;

    const request = role === 'PATIENT'
      ? this.patientService.registerToAuth(formData)
      : this.medecinService.createMedecin(formData);

    request.subscribe({
      next: (res) => {
        this.success = 'Inscription réussie ! Votre compte est en attente de validation par un administrateur.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 5000);
      },
      error: (err) => {
        this.error = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
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
