import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../HttpService/http.service';
import { DateService } from '../DateService/date.service';
import { Operation } from 'src/app/components/models/operation';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EarningsService {
  private earningsStorageItem: string = 'earnings';
  private startDateStorageItem: string = 'startDateEarnings';
  private endDateStorageItem: string = 'endDateEarnings';
  private maxEarningValueStorageItem: string = 'maxEarning';
  earnings: Operation[] = [];
  earningsChannel: BehaviorSubject<Operation[]> = new BehaviorSubject(this.earnings);
  categoriesChannel: BehaviorSubject<string[]> = new BehaviorSubject([""]);

  constructor(
    private httpService: HttpService,
    private dateService: DateService
  ) { }

  updateTotal(earnings: Operation[]) {
    // this.earnings = earnings.map(e => e.currentValueInPLN).reduce((a,b) => { return a + b }, 0);
    this.earningsChannel.next(this.earnings);
  }

  async addEarnings(items: Operation[]) {
    this.httpService.addEarning(JSON.stringify(items)).subscribe(_ =>
      this.httpService.getEarnings().subscribe(e => {
        this.earnings = e;
        this.updateEarnings();
        this.earningsChannel.next(this.earnings);
      })
    );
  }

  async getEarnings() {
    let earnings: Operation[] = JSON.parse(window.sessionStorage.getItem(this.earningsStorageItem)!);

    if (earnings != null && earnings.length > 0) {
      this.earnings = earnings;
      this.earningsChannel.next(this.earnings);
    }

    this.httpService.getEarnings().subscribe(e => {
      this.earnings = e;
      this.updateEarnings();
      this.earningsChannel.next(this.earnings);
    });
  }

  private updateEarnings() {
    if (this.earnings.length == 0) {
      this.clearStorage();
      return;      
    }

    this.earnings.forEach(e => e.date = this.dateService.FormatDateToLocale(new Date(e.date)));

    let startDate = this.earnings.reduce(function (a, b) { return new Date(a.date) < new Date(b.date) ? a : b; }).date;
    let endDate = new Date();
    let maxEarning = this.earnings.reduce((a,b) => a.currentValueInPLN > b.currentValueInPLN ? a : b).currentValueInPLN;

    window.sessionStorage.setItem(this.earningsStorageItem, JSON.stringify(this.earnings)); 
    window.sessionStorage.setItem(this.startDateStorageItem, startDate);
    window.sessionStorage.setItem(this.endDateStorageItem, this.dateService.FormatDateToLocale(endDate));
    window.sessionStorage.setItem(this.maxEarningValueStorageItem, maxEarning);
  }

  private clearStorage() {
    window.sessionStorage.setItem(this.earningsStorageItem, "[]");
    window.sessionStorage.setItem(this.startDateStorageItem, "{}");
    window.sessionStorage.setItem(this.endDateStorageItem, "{}");
    window.sessionStorage.setItem(this.maxEarningValueStorageItem, "{}");
  }

  deleteEarning(items: Operation[], index: number) {
    this.earnings = items;
    let earningId = this.earnings[index].id;
    this.httpService.deleteEarning(earningId).subscribe();

    this.earnings.splice(index, 1);
    this.updateEarnings();
    this.earningsChannel.next(this.earnings);
  }

  async getCategories() {
    this.httpService.getEarningCategories().subscribe(c => this.categoriesChannel.next(c));
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
