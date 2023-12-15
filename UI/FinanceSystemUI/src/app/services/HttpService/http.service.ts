import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../../components/models/token';
import { Earning } from '../../components/models/earning';
import { AuthService } from '../AuthService/auth.service';
import { Observable } from 'rxjs';
import { ExchangeRate } from 'src/app/components/models/exchangeRate';
import { ConnectedUser } from 'src/app/components/models/connectedUser';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl: string = "https://localhost:7112/";
  private registrationUrl: string = this.baseUrl + "Authorization/Register/";
  private loginUrl: string = this.baseUrl + "Authorization/Login/";
  private earningsUrl: string = this.baseUrl + "Earnings/";
  private exchangeRatesUrl: string = this.baseUrl + "ExchangeRates/";
  private currenciesUrl: string = this.baseUrl + "ExchangeRates/Currencies/";
  private earningCategoriesUrl: string = this.baseUrl + "Earnings/Categories/";
  private connectedUsersUrl: string = this.baseUrl + "User/";
  private changeUsernameUrl: string = this.baseUrl + "User/Name";
  private connectUserCodeUrl: string = this.baseUrl + "User/ConnectionCode";
  
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

  getExchangeRates() : Observable<ExchangeRate[]> {
    if (this.authService.isUserLoggedIn())
    {
      this.options.headers = this.options.headers.set('Authorization', "Bearer " + window.sessionStorage.getItem("accessToken"));

      return this.http.get<ExchangeRate[]>(this.exchangeRatesUrl, this.options);
    }

    return new Observable<ExchangeRate[]>;    
  }

  getCurrencies() : Observable<string[]> {
    if (this.authService.isUserLoggedIn())
    {
      this.options.headers = this.options.headers.set('Authorization', "Bearer " + window.sessionStorage.getItem("accessToken"));

      return this.http.get<string[]>(this.currenciesUrl, this.options);
    }

    return new Observable<string[]>;    
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

  connectUser() {
    if (this.authService.isUserLoggedIn())
    {
      this.options.headers = this.options.headers.set('Authorization', "Bearer " + window.sessionStorage.getItem("accessToken"));

      return this.http.get<string>(this.connectUserCodeUrl, this.options);
    }

    return new Observable<string>;
  }

  setConnectedUsername(userId: number, username: string) {
    if (this.authService.isUserLoggedIn())
    {
      this.options.headers = this.options.headers.set('Authorization', "Bearer " + window.sessionStorage.getItem("accessToken"));

      return this.http.put(this.changeUsernameUrl, { "UserId": userId, "Username": username }, this.options);
    }

    return new Observable<string>;
  }

  checkConnectionCode(connectionCode: string) {
    if (this.authService.isUserLoggedIn())
    {
      this.options.headers = this.options.headers.set('Authorization', "Bearer " + window.sessionStorage.getItem("accessToken"));

      return this.http.post(this.connectUserCodeUrl, connectionCode, this.options);
    }

    return new Observable;
  }

  getConnectedUsers() : Observable<ConnectedUser[]> {
    if (this.authService.isUserLoggedIn())
    {
      this.options.headers = this.options.headers.set('Authorization', "Bearer " + window.sessionStorage.getItem("accessToken"));

      return this.http.get<ConnectedUser[]>(this.connectedUsersUrl, this.options);
    }

    return new Observable<ConnectedUser[]>;    
  }
}
