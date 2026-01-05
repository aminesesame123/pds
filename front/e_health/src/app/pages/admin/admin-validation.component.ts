import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-validation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5>Validation des Comptes en Attente</h5>
      </div>
      <div class="card-block table-border-style">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of pendingUsers">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>
                  <button class="btn btn-success btn-sm" (click)="approveUser(user.id)">Valider</button>
                </td>
              </tr>
              <tr *ngIf="pendingUsers.length === 0">
                <td colspan="5" class="text-center">Aucun compte en attente de validation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { margin: 20px; }
  `]
})
export class AdminValidationComponent implements OnInit {
  pendingUsers: any[] = [];
  private adminApiUrl = `${environment.apiUrl}/auth-service/api/admin`;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers() {
    this.http.get<any[]>(`${this.adminApiUrl}/pending-users`).subscribe({
      next: (users) => this.pendingUsers = users,
      error: (err) => console.error('Error loading pending users', err)
    });
  }

  approveUser(userId: string) {
    this.http.post(`${this.adminApiUrl}/approve-user/${userId}`, {}).subscribe({
      next: () => {
        alert('Compte validé avec succès !');
        this.loadPendingUsers();
      },
      error: (err) => alert('Erreur lors de la validation : ' + err.message)
    });
  }
}
