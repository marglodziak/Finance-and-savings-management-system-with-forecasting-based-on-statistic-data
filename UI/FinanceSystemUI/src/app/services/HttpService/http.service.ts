import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token } from '../../components/models/token';
import { Earning } from '../../components/models/earning';
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
  private accessTokenUrl: string = this.baseUrl + "Authorization/AccessToken/";
  private earningsUrl: string = this.baseUrl + "Earnings/";
  private exchangeRatesUrl: string = this.baseUrl + "ExchangeRates/";
  private currenciesUrl: string = this.baseUrl + "ExchangeRates/Currencies/";
  private earningCategoriesUrl: string = this.baseUrl + "Earnings/Categories/";
  private usersIAmConnectedToUrl: string = this.baseUrl + "User/IAmConnectedTo";
  private usersConnectedToMeUrl: string = this.baseUrl + "User/ConnectedToMe";
  private changeUsernameUrl: string = this.baseUrl + "User/Name";
  private connectUserCodeUrl: string = this.baseUrl + "User/ConnectionCode";

  constructor(private http:HttpClient){ }

  registerNewUser(email: string, password: string) {
    return this.http.post(this.registrationUrl, { "Email": email, "Password": password});
  }

  logIn(email: string, password: string) {
    return this.http.post<Token>(this.loginUrl, { "Email": email, "Password": password});
  }

  getNewAccessToken(refreshToken: string) {
   return this.http.post<Token>(this.accessTokenUrl, `"${refreshToken}"`);
  }

  getExchangeRates() : Observable<ExchangeRate[]> {
    return this.http.get<ExchangeRate[]>(this.exchangeRatesUrl);   
  }

  getCurrencies() : Observable<string[]> {
    return this.http.get<string[]>(this.currenciesUrl);  
  }

  getEarnings() : Observable<Earning[]> {
    return this.http.get<Earning[]>(this.earningsUrl)
  }

  deleteEarning(earningId: number) {
    return this.http.delete(this.earningsUrl, { body: `"${earningId}"` });
  }

  getEarningCategories() : Observable<string[]> {
    return this.http.get<string[]>(this.earningCategoriesUrl);
  }

  addEarning(body: string) {
    return this.http.post(this.earningsUrl, body);
  }

  connectUser() {
    return this.http.get<string>(this.connectUserCodeUrl);
  }

  setConnectedUsername(userId: number, username: string) {
    return this.http.put(this.changeUsernameUrl, { "UserId": userId, "Username": username });
  }

  checkConnectionCode(connectionCode: string) {
    return this.http.post(this.connectUserCodeUrl, connectionCode);
  }

  getUsersIAmConnectedTo() : Observable<ConnectedUser[]> {
    return this.http.get<ConnectedUser[]>(this.usersIAmConnectedToUrl); 
  }

  getUsersConnectedToMe() : Observable<ConnectedUser[]> {
    return this.http.get<ConnectedUser[]>(this.usersConnectedToMeUrl);
  }

  deleteUserIAmConnectedTo(username: string) {
    return this.http.delete(this.usersIAmConnectedToUrl, { body: `"${username}"` });
  }

  deleteUserConnectedToMe(email: string) {
    return this.http.delete(this.usersConnectedToMeUrl, { body: `"${email}"` });
  }
}
