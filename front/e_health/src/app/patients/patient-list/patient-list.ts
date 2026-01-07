import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-list.html',
  styleUrls: ['./patient-list.css'],
})
export class PatientList implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  loading = false;

  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.fetchPatients();
  }

  fetchPatients() {
    this.loading = true;
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching patients', err);
        // Mock data for demo if backend empty/fails
        // this.filteredPatients = [
        //   { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@test.com' },
        //   { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@test.com' }
        // ];
        this.loading = false;
      }
    });
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.filteredPatients = this.patients.filter(p =>
      p.nom?.toLowerCase().includes(term) ||
      p.prenom?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
  }

  viewPatient(id: number) {
    console.log('Viewing patient:', id);
  }
}
