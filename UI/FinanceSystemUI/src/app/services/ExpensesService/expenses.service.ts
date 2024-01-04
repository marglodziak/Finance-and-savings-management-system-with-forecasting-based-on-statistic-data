import { Injectable } from '@angular/core';
import { HttpService } from '../HttpService/http.service';
import { lastValueFrom, max } from 'rxjs';
import { Operation } from 'src/app/components/models/operation';
import { DateService } from '../DateService/date.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private expensesStorageItem: string = 'expenses';
  private startDateStorageItem: string = 'startDateExpenses';
  private endDateStorageItem: string = 'endDateExpenses';
  private maxExpenseValueStorageItem: string = 'maxExpense';

  constructor(
    private httpService: HttpService,
    private dateService: DateService
  ) { }

  async sumExpenses() {
    let expenses = await this.getExpenses();
    return expenses.map(e => e.currentValueInPLN).reduce((a,b) => { return a + b }, 0);
  }

  async getExpenses() {
    let expenses: Operation[] = JSON.parse(window.sessionStorage.getItem(this.expensesStorageItem)!);

    if (expenses != null && expenses.length > 0) {
      return expenses;
    }

    expenses = await lastValueFrom(this.httpService.getExpenses());
    if (expenses.length == 0) {
      return expenses;
    }

    expenses.forEach(e => e.date = this.dateService.FormatDateToLocale(new Date(e.date)));
    
    let startDate = expenses.reduce(function (a, b) { return new Date(a.date) < new Date(b.date) ? a : b; }).date;
    let endDate = new Date();
    let maxExpense = expenses.reduce((a,b) => a.currentValueInPLN > b.currentValueInPLN ? a : b).currentValueInPLN;

    window.sessionStorage.setItem(this.expensesStorageItem, JSON.stringify(expenses));
    window.sessionStorage.setItem(this.startDateStorageItem, startDate);
    window.sessionStorage.setItem(this.endDateStorageItem, this.dateService.FormatDateToLocale(endDate));
    window.sessionStorage.setItem(this.maxExpenseValueStorageItem, maxExpense);

    return expenses;
  }

  async getCategories() {
    return await lastValueFrom(this.httpService.getExpenseCategories());
  }

  getStartDate() {
    return window.sessionStorage.getItem(this.startDateStorageItem)!;
  }

  getEndDate() {
    return window.sessionStorage.getItem(this.endDateStorageItem)!;
  }

  getMaxExpenseValue() {
    return parseFloat(window.sessionStorage.getItem(this.maxExpenseValueStorageItem)!);
  }
}
