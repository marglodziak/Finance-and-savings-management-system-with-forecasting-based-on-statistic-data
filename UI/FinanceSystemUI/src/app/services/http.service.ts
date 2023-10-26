import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpService {


  private registrationUrl: string = "https://localhost:7112/Authorization/Register/";
  private loginUrl: string = "https://localhost:7112/Authorization/Login/";
  private testUrl: string = "https://www.boredapi.com/api/activity";
  private options = { headers: new HttpHeaders({"ContentType": "application/json"}) };

  constructor(private http:HttpClient){ }

  registerNewUser(email: string, password: string)
  {
    return this.http.post(this.registrationUrl, { "Email": email, "Password": password}, this.options);
  }

  logIn(email: string, password: string)
  {
    return this.http.post(this.loginUrl, { "Email": email, "Password": password}, this.options);
  }
}
