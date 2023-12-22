import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  roleId: number = 0;
  accessTokenField: string = "accessToken";
  refreshTokenField: string = "refreshToken";

  constructor() { }

  getAccessToken() {
    return window.sessionStorage.getItem(this.accessTokenField);
  }

  getRefreshToken() {
    return window.sessionStorage.getItem(this.refreshTokenField) ?? "";
  }

  SaveAccessToken(token: string)
  {
    window.sessionStorage.setItem(this.accessTokenField, token);
  }

  SaveRefreshToken(token: string)
  {
    window.sessionStorage.setItem(this.refreshTokenField, token);
  }

  LogOut() {
    window.sessionStorage.clear();
    // window.location.reload();
  }

  isUserLoggedIn()
  {
    let token = window.sessionStorage.getItem(this.accessTokenField) ?? "";
    return this.isAccessTokenValid(token)
  }

  private isAccessTokenValid(token: string)
  {
    return token != "";
  }
}
