import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../../components/models/token';
import { Earning } from '../../components/models/earning';
import { AuthService } from '../AuthService/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl: string = "https://localhost:7112/";
  private registrationUrl: string = this.baseUrl + "Authorization/Register/";
  private loginUrl: string = this.baseUrl + "Authorization/Login/";
  private earningsUrl: string = this.baseUrl + "Finances/Earnings/";
  private earningCategoriesUrl: string = this.baseUrl + "Finances/EarningCategories/";
  private options = { 'headers': new HttpHeaders({"Content-Type": "application/json"}) };

  constructor(private http:HttpClient, private authService: AuthService){ }

  registerNewUser(email: string, password: string)
  {
    return this.http.post(this.registrationUrl, { "Email": email, "Password": password}, this.options);
  }

  logIn(email: string, password: string)
  {
    return this.http.post<Token>(this.loginUrl, { "Email": email, "Password": password}, this.options);
  }

  getEarnings() : Observable<Earning[]>
  {
    if (this.authService.isUserLoggedIn())
    {
      this.options.headers = this.options.headers.set('Authorization', "Bearer " + window.sessionStorage.getItem("accessToken"));

      return this.http.get<Earning[]>(this.earningsUrl, this.options);
    }

    return new Observable<Earning[]>;    
  }

  getEarningCategories() : Observable<string[]>
  {
    if (this.authService.isUserLoggedIn())
    {
      this.options.headers = this.options.headers.set('Authorization', "Bearer " + window.sessionStorage.getItem("accessToken"));

      return this.http.get<string[]>(this.earningCategoriesUrl, this.options);
    }

    return new Observable<string[]>;    
  }

  addEarning(body: string)
  {
    return this.http.post(this.earningsUrl, body, this.options);
  }
}
