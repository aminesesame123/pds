import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedecinService } from '../../services/medecin.service';

@Component({
  selector: 'app-medecin-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medecin-list.html',
  styleUrls: ['./medecin-list.css'],
})
export class MedecinList implements OnInit {
  medecins: any[] = [];
  filteredMedecins: any[] = [];
  loading = false;

  constructor(private medecinService: MedecinService) { }

  ngOnInit() {
    this.fetchMedecins();
  }

  fetchMedecins() {
    this.loading = true;
    this.medecinService.getMedecins().subscribe({
      next: (data) => {
        this.medecins = data;
        this.filteredMedecins = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching medecins', err);
        this.loading = false;
      }
    });
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.filteredMedecins = this.medecins.filter(m =>
      m.nom?.toLowerCase().includes(term) ||
      m.prenom?.toLowerCase().includes(term) ||
      m.specialite?.toLowerCase().includes(term)
    );
  }

  viewMedecin(id: number) {
    console.log('Viewing medecin:', id);
  }
}
