import { Injectable } from '@angular/core';
import { HttpService } from '../HttpService/http.service';
import { DateService } from '../DateService/date.service';
import { Operation } from 'src/app/components/models/operation';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { SortingService } from '../SortingService/sorting.service';

@Injectable({
  providedIn: 'root'
})
export class EarningsService {
  private earningsStorageItem: string = 'earnings';
  private startDateStorageItem: string = 'startDateEarnings';
  private endDateStorageItem: string = 'endDateEarnings';
  private maxEarningValueStorageItem: string = 'maxEarning';
  total: number = 0;
  testing: BehaviorSubject<number> = new BehaviorSubject(this.total);

  constructor(
    private httpService: HttpService,
    private dateService: DateService,
    private sortingService: SortingService
  ) { }

  async sumEarnings() {
    let earnings = await this.getEarnings();
    this.updateTotal(earnings);

    return this.total;
  }

  updateTotal(earnings: Operation[]) {
    this.total = earnings.map(e => e.currentValueInPLN).reduce((a,b) => { return a + b }, 0);
    this.testing.next(this.total);
  }

  async addEarnings(items: Operation[]) {
    this.httpService.addEarning(JSON.stringify(items)).subscribe();
    let earnings = await lastValueFrom(this.httpService.getEarnings());
    this.updateEarnings(earnings);
    this.updateTotal(earnings);

    return earnings;
  }

  async getEarnings() {
    let earnings: Operation[] = JSON.parse(window.sessionStorage.getItem(this.earningsStorageItem)!);

    if (earnings != null && earnings.length > 0) {
      return earnings;
    }

    earnings = await lastValueFrom(this.httpService.getEarnings());
    this.updateEarnings(earnings);

    return earnings;
  }

  private updateEarnings(earnings: Operation[]) {
    if (earnings.length == 0) {
      return;
    }

    earnings.forEach(e => e.date = this.dateService.FormatDateToLocale(new Date(e.date)));

    let startDate = earnings.reduce(function (a, b) { return new Date(a.date) < new Date(b.date) ? a : b; }).date;
    let endDate = new Date();
    let maxExpense = earnings.reduce((a,b) => a.currentValueInPLN > b.currentValueInPLN ? a : b).currentValueInPLN;

    window.sessionStorage.setItem(this.earningsStorageItem, JSON.stringify(earnings));
    window.sessionStorage.setItem(this.startDateStorageItem, startDate);
    window.sessionStorage.setItem(this.endDateStorageItem, this.dateService.FormatDateToLocale(endDate));
    window.sessionStorage.setItem(this.maxEarningValueStorageItem, maxExpense);
  }

  deleteEarning(items: Operation[], index: number) {
    let earningId = items[index].id;
    this.httpService.deleteEarning(earningId).subscribe();

    items.splice(index, 1);
    this.updateEarnings(items);
    this.updateTotal(items);

    return items;
  }

  async getCategories() {
    return await lastValueFrom(this.httpService.getEarningCategories());
  }

  getStartDate() {
    return window.sessionStorage.getItem(this.startDateStorageItem)!;
  }

  getEndDate() {
    return window.sessionStorage.getItem(this.endDateStorageItem)!;
  }

  getMaxEearningValue() {
    return parseFloat(window.sessionStorage.getItem(this.maxEarningValueStorageItem)!);
  }
}
