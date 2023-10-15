import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private registrationUrl: string = "https://localhost:7112/Authorization/Register/";
  private testUrl: string = "https://www.boredapi.com/api/activity";

  constructor(private http:HttpClient){ }

  registerNewUser(email: string, password: string)
  {
    var options = { headers: new HttpHeaders({"ContentType": "application/json"}) };
    return this.http.post(this.registrationUrl, { "Email": email, "Password": password}, options);
  }
}
