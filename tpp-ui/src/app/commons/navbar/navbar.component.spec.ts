import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeService } from '../../services/customize.service';
import { TppUserService } from '../../services/tpp.user.service';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IconModule } from '../icon/icon.module';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, IconModule],
      providers: [TestBed.overrideProvider(AuthService, { useValue: authServiceSpy }), CustomizeService, TppUserService, AuthService],
      declarations: [NavbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authServiceSpy.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();
  });

  it('should call loggedIn', () => {
    expect(component).toBeTruthy();
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
  });

  it('should logout the tpp user', () => {
    component.onLogout();
  });

  it('should throw error when the user is not logged in', () => {
    component.ngDoCheck();
  });
});
