import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MedecinService {
    private apiUrl = `${environment.apiUrl}/medecin-service/api/medecins`;

    constructor(private http: HttpClient) { }

    getMedecins(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getMedecin(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createMedecin(medecin: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, medecin);
    }

    deleteMedecin(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
