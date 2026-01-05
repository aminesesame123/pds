import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomAuthService {
    private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('access_token'));
    public token$ = this.tokenSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    login(username: string, password: string): Observable<any> {
        const body = new HttpParams()
            .set('client_id', 'frontend-client') // Ensure this client allows Direct Access Grants
            .set('grant_type', 'password')
            .set('username', username)
            .set('password', password);
        // For public clients, client_secret is not needed.

        return this.http.post(`${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`, body, {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        }).pipe(
            tap((response: any) => {
                console.log('AuthService: Login Response', response);
                this.setSession(response);
            }, (error) => {
                console.error('AuthService: Login Error', error);
            })
        );
    }

    private setSession(authResult: any) {
        localStorage.setItem('access_token', authResult.access_token);
        localStorage.setItem('refresh_token', authResult.refresh_token);
        this.tokenSubject.next(authResult.access_token);
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.tokenSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isLoggedIn(): boolean {
        // Basic check. In production, check expiration (exp) in JWT.
        return !!this.getToken();
    }

    getProfile(): any {
        const token = this.getToken();
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            console.error('Error decoding token', e);
            return null;
        }
    }
}
