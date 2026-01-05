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
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching patients', err);
        this.loading = false;
      }
    });
  }

  viewPatient(id: number) {
    console.log('Viewing patient:', id);
    // TODO: Navigate to details page
  }
}
