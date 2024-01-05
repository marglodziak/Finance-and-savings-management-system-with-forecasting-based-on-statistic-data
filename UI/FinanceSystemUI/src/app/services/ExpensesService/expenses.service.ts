import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../HttpService/http.service';
import { BehaviorSubject, lastValueFrom, max } from 'rxjs';
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
  expenses: Operation[] = [];
  expensesChannel: BehaviorSubject<Operation[]> = new BehaviorSubject(this.expenses);
  categoriesChannel: BehaviorSubject<string[]> = new BehaviorSubject([""]);

  constructor(
    private httpService: HttpService,
    private dateService: DateService
  ) { }

  addExpenses(items: Operation[]) {
    this.httpService.addExpense(JSON.stringify(items)).subscribe();
    this.httpService.getExpenses().subscribe(e => {
      this.expenses = e;
      this.updateExpenses();
      this.expensesChannel.next(this.expenses);
    })
  }

  async getExpenses() {
    let expenses: Operation[] = JSON.parse(window.sessionStorage.getItem(this.expensesStorageItem)!);

    if (expenses != null && expenses.length > 0) {
      this.expenses = expenses;
      this.expensesChannel.next(expenses);
    }

    this.httpService.getExpenses().subscribe(e => {
      this.expenses = e;
      this.updateExpenses();
      this.expensesChannel.next(this.expenses);
    });
  }

  private updateExpenses() {
    if (this.expenses.length == 0) {
      this.clearStorage();
      return;
    }

    this.expenses.forEach(e => e.date = this.dateService.FormatDateToLocale(new Date(e.date)));

    let startDate = this.expenses.reduce(function (a, b) { return new Date(a.date) < new Date(b.date) ? a : b; }).date;
    let endDate = new Date();
    let maxExpense = this.expenses.reduce((a,b) => a.currentValueInPLN > b.currentValueInPLN ? a : b).currentValueInPLN;

    window.sessionStorage.setItem(this.expensesStorageItem, JSON.stringify(this.expenses));
    window.sessionStorage.setItem(this.startDateStorageItem, startDate);
    window.sessionStorage.setItem(this.endDateStorageItem, this.dateService.FormatDateToLocale(endDate));
    window.sessionStorage.setItem(this.maxExpenseValueStorageItem, maxExpense);
  }

  private clearStorage() {
    window.sessionStorage.setItem(this.expensesStorageItem, "[]");
    window.sessionStorage.setItem(this.startDateStorageItem, "{}");
    window.sessionStorage.setItem(this.endDateStorageItem, "{}");
    window.sessionStorage.setItem(this.maxExpenseValueStorageItem, "{}");
  }

  deleteExpense(items: Operation[], index: number) {
    this.expenses = items;
    let expenseId = this.expenses[index].id;
    this.httpService.deleteExpense(expenseId).subscribe();

    this.expenses.splice(index, 1);
    this.updateExpenses();
    this.expensesChannel.next(this.expenses);
  }

  async getCategories() {
    this.httpService.getExpenseCategories().subscribe(c => this.categoriesChannel.next(c));    
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
