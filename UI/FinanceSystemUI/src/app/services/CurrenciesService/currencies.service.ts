import { Injectable } from '@angular/core';
import { HttpService } from '../HttpService/http.service';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  currencies: string[] = []

  constructor(private httpService: HttpService) {
    this.httpService.getCurrencies().subscribe(currencies => this.currencies = currencies);
  }
}
