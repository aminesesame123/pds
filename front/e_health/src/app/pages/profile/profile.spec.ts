import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile';
import { CustomAuthService } from '../../auth/custom-auth.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockAuthService = {
    getProfile: () => ({
      preferred_username: 'TestUser',
      email: 'test@test.com',
      given_name: 'Test',
      family_name: 'User',
      realm_access: { roles: ['PATIENT'] }
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: CustomAuthService, useValue: mockAuthService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
