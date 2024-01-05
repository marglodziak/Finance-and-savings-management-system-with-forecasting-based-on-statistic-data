import { Injectable } from '@angular/core';
import { HttpService } from '../HttpService/http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  currenciesChannel: BehaviorSubject<string[]> = new BehaviorSubject([""]);

  constructor(private httpService: HttpService) { }

  async getCurrencies() {
    this.httpService.getCurrencies().subscribe(c => this.currenciesChannel.next(c));
  }
}
