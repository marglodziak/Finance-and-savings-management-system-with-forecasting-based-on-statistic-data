import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl: string = "https://localhost:7112/";
  private registrationUrl: string = this.baseUrl + "Authorization/Register/";
  private loginUrl: string = this.baseUrl + "Authorization/Login/";
  private earningsUrl: string = this.baseUrl + "Finances/Earnings/";
  private options = { headers: new HttpHeaders({"Content-Type": "application/json"}) };

  constructor(private http:HttpClient){ }

  registerNewUser(email: string, password: string)
  {
    return this.http.post(this.registrationUrl, { "Email": email, "Password": password}, this.options);
  }

  logIn(email: string, password: string)
  {
    return this.http.post(this.loginUrl, { "Email": email, "Password": password}, this.options);
  }

  addEarning(body: string)
  {
    return this.http.post(this.earningsUrl, body, this.options);
  }
}
