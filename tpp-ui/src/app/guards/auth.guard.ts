import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate() {
    const res = this.authService.isLoggedIn();

    if (!res) {
      this.authService.logout();
    }
    return res;
  }
}
