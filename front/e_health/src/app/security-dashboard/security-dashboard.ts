import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-security-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './security-dashboard.html',
    styleUrls: ['./security-dashboard.css']
})
export class SecurityDashboardComponent implements OnInit {
    auditLogs: any[] = [];
    loading = false;

    constructor() {
        // Mock data for initial view
        this.auditLogs = [
            { timestamp: new Date(), action: 'CONNEXION_REUSSIE', username: 'admin@medinsight.com', serviceName: 'GATEWAY', status: 'SUCCESS' },
            { timestamp: new Date(), action: 'MODIFICATION_PATIENT', username: 'dr.martin@medinsight.com', serviceName: 'PATIENT-SERVICE', status: 'SUCCESS' },
            { timestamp: new Date(), action: 'AJOUT_LOG', username: 'system', serviceName: 'AUDIT-SERVICE', status: 'SUCCESS' }
        ];
    }

    ngOnInit(): void {
    }
}
