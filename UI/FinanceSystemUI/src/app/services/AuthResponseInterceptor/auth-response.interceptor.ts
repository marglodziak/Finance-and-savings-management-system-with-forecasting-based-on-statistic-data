import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, lastValueFrom, throwError } from 'rxjs';
import { AuthService } from '../AuthService/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../HttpService/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthResponseInterceptor implements HttpInterceptor {
  auth: AuthService;
  http: HttpService;

  constructor(private injector: Injector, private router: Router) {
    this.auth = this.injector.get(AuthService);
    this.http = this.injector.get(HttpService);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    let token = this.auth.isUserLoggedIn() ? this.auth.getAccessToken() : null;
    req = this.setDefaultHeaders(req);    

    if (token) {
      req = this.setAuthHeader(req, token);
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return this.handleError(req, next);
          }

          throw error;
        })
    )}
    else {
      return next.handle(req);
    }
  }

  private setDefaultHeaders(req: HttpRequest<any>) {
    return req.clone({
      headers: req.headers.set("Content-Type", "application/json")
    });
  }

  private setAuthHeader(req: HttpRequest<any>, token: string) {
    return req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`)
    });
  }

  private async handleError(req: HttpRequest<any>, next: HttpHandler) {
    let refreshToken = this.auth.getRefreshToken();

    try {
      let tokens = await lastValueFrom(this.http.getNewAccessToken(refreshToken));
    
      this.auth.SaveAccessToken(tokens.accessToken);
      this.auth.SaveRefreshToken(tokens.refreshToken);
      req = req.clone({ headers: req.headers.set("Authorization", `Bearer ${tokens.accessToken}`)});
    }
    catch {
      this.auth.LogOut();
      window.location.reload();
    }

    return await lastValueFrom(next.handle(req));      
  }
}
