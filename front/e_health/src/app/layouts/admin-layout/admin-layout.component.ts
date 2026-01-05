import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CustomAuthService } from '../../auth/custom-auth.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
    isCollapsedMobile = 'no-block';
    pcodedDeviceType: string = 'desktop';
    verticalNavType: string = 'expanded';
    verticalEffect: string = 'shrink';
    chatToggle = 'out';
    chatInnerToggle = 'off';

    userProfile: any;

    constructor(private authService: CustomAuthService, private router: Router) {
        this.userProfile = this.authService.getProfile();
        this.onResize(null); // Init device type
    }

    toggleOpened() {
        if (window.innerWidth < 992) {
            this.isCollapsedMobile = this.isCollapsedMobile === 'yes-block' ? 'no-block' : 'yes-block';
        } else {
            this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
        }
    }

    onResize(event: any) {
        this.pcodedDeviceType = window.innerWidth < 992 ? 'mobile' : 'desktop';
        if (this.pcodedDeviceType === 'mobile') {
            this.verticalNavType = 'offcanvas';
            this.verticalEffect = 'overlay';
        } else {
            this.verticalNavType = 'expanded';
            this.verticalEffect = 'shrink';
        }
    }

    onMobileMenu() {
        this.isCollapsedMobile = this.isCollapsedMobile === 'yes-block' ? 'no-block' : 'yes-block';
    }

    logout() {
        this.authService.logout();
    }

    hasRole(role: string): boolean {
        const profile = this.userProfile;
        return profile?.realm_access?.roles?.includes(role);
    }

    get isAdmin(): boolean {
        return this.hasRole('ADMIN');
    }
}
