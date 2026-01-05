import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-pending-registrations',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pending-registrations.html',
    styleUrls: ['./pending-registrations.css']
})
export class PendingRegistrationsComponent implements OnInit {
    pendingUsers: any[] = [];
    loading = false;
    actionLoading = false;

    private apiUrl = `${environment.apiUrl}/auth-service/api/admin`;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadPendingUsers();
    }

    loadPendingUsers() {
        this.loading = true;
        this.http.get<any[]>(`${this.apiUrl}/pending-users`).subscribe({
            next: (users) => {
                this.pendingUsers = users;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading pending users:', err);
                this.loading = false;
            }
        });
    }

    approveUser(userId: string) {
        this.actionLoading = true;
        this.http.post(`${this.apiUrl}/approve-user/${userId}`, {}).subscribe({
            next: () => {
                this.pendingUsers = this.pendingUsers.filter(u => u.id !== userId);
                this.actionLoading = false;
                alert('Utilisateur approuvé avec succès !');
            },
            error: (err) => {
                console.error('Error approving user:', err);
                this.actionLoading = false;
                alert('Erreur lors de l\'approbation.');
            }
        });
    }
}
