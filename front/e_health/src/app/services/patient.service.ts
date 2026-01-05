import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    // Use Gateway URL with Service ID for Discovery Locator
    private apiUrl = `${environment.apiUrl || 'http://localhost:8080'}/patient-service/api/patients`;

    constructor(private http: HttpClient) { }

    getPatients(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getPatient(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createPatient(patient: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, patient);
    }

    updatePatient(id: number, patient: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, patient);
    }

    deletePatient(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    register(user: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, user);
    }

    registerToAuth(user: any): Observable<any> {
        // Points to the consolidated registration in Patient-Service via Gateway
        const url = `${environment.apiUrl}/patient-service/api/patients/register`;
        return this.http.post<any>(url, user);
    }
}
