import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  roleId: number = 0;

  constructor() { }

  ProcessToken(token: string)
  {
    window.sessionStorage.setItem("accessToken", token);
  }

  isUserLoggedIn()
  {
    let token = window.sessionStorage.getItem("accessToken") ?? "";
    return this.isAccessTokenValid(token)
  }

  private isAccessTokenValid(token: string)
  {
    return token != "";
  }
}
