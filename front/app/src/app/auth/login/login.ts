import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: false
})
export class LoginComponent {

  constructor(private keycloak: KeycloakService) { }

  login() {
    this.keycloak.login({
      redirectUri: window.location.origin + '/admin/dashboard'
    });
  }
}
