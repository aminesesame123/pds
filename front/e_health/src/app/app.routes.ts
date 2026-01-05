import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { CustomAuthService } from './auth/custom-auth.service';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PatientList } from './patients/patient-list/patient-list';
import { MedecinList } from './medecins/medecin-list/medecin-list';
import { PendingRegistrationsComponent } from './admin/pending-registrations/pending-registrations';
import { SecurityDashboardComponent } from './security-dashboard/security-dashboard';

const authGuard = () => {
    const auth = inject(CustomAuthService);
    const router = inject(Router);
    return auth.isLoggedIn() || router.createUrlTree(['/login']);
};

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: HomeComponent },
            { path: 'patients', component: PatientList },
            { path: 'medecins', component: MedecinList },
            { path: 'admin/validations', component: PendingRegistrationsComponent },
            { path: 'security-dashboard', component: SecurityDashboardComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];
