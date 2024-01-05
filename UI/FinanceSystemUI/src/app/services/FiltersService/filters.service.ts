import { Injectable } from '@angular/core';
import { Filters } from 'src/app/components/models/filters';
import { EarningsService } from '../EarningsService/earnings.service';
import { ExpensesService } from '../ExpensesService/expenses.service';
import { DateService } from '../DateService/date.service';
import { Operation } from 'src/app/components/models/operation';
import { BehaviorSubject } from 'rxjs';
import { SortingService } from '../SortingService/sorting.service';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  earningsFilters: Filters = new Filters();
  expensesFilters: Filters = new Filters();
  filteredEarnings: Operation[] = [];
  filteredExpenses: Operation[] = [];
  earningFiltersChannel: BehaviorSubject<Filters> = new BehaviorSubject(new Filters());
  expenseFiltersChannel: BehaviorSubject<Filters> = new BehaviorSubject(new Filters());
  filteredEarningsChannel: BehaviorSubject<Operation[]> = new BehaviorSubject(this.filteredEarnings);
  filteredExpensesChannel: BehaviorSubject<Operation[]> = new BehaviorSubject(this.filteredExpenses);
  
  constructor(
    private earningsService: EarningsService,
    private expensesService: ExpensesService,
  ) {
    this.earningsService.earningsChannel.subscribe(earnings => {
      this.earningsFilters = this.buildEarningsFilters(earnings);
      this.earningFiltersChannel.next(this.earningsFilters);
      this.getFilteredEarnings();
    });
    this.expensesService.expensesChannel.subscribe(expenses => {
      this.expensesFilters = this.buildExpensesFilters(expenses);
      this.expenseFiltersChannel.next(this.expensesFilters);
      this.getFilteredExpenses();
    })
  }

  private buildEarningsFilters(items: Operation[]) {
    var filters = new Filters();

    if (items.length == 0) {
      return filters;
    }

    filters.startDate = items.reduce(function (a, b) { return new Date(a.date) < new Date(b.date) ? a : b; }).date;
    filters.endDate = this.earningsService.getEndDate();
    filters.maxValue = this.earningsService.getMaxEearningValue();

    return filters;
  }

  private buildExpensesFilters(items: Operation[]) {
    var filters = new Filters();

    if (items.length == 0) {
      return filters;
    }

    filters.startDate = items.reduce(function (a, b) { return new Date(a.date) < new Date(b.date) ? a : b; }).date;
    filters.endDate = this.expensesService.getEndDate();
    filters.maxValue = this.expensesService.getMaxExpenseValue();

    return filters;
  }

  getFilteredEarnings() {
    let earnings = this.earningsService.earnings;

    if (earnings.length == 0) {
      return;
    }

    let filters = this.earningsFilters;
    this.filteredEarnings = this.filterItems(earnings, filters);

    this.filteredEarningsChannel.next(this.filteredEarnings);
  }

  getFilteredExpenses() {
    let expenses = this.expensesService.expenses;

    if (expenses.length == 0) {
      return;
    }

    let filters = this.expensesFilters;
    this.filteredExpenses = this.filterItems(expenses, filters);

    this.filteredExpensesChannel.next(this.filteredExpenses);
  }

  filterItems(items: Operation[], filters: Filters) {
    let startDate = new Date(filters.startDate);
    let endDate = new Date(filters.endDate);

    let result = items.filter(i => 
       (startDate <= new Date(i.date) && new Date(i.date) <= endDate)
    && (filters.category == "all" || filters.category == i.category)
    && (filters.minValue.toString() != "" ? filters.minValue <= i.value : 0 <= i.value)
    && (filters.maxValue.toString() != "" ? filters.maxValue >= i.value : i.value < Number.MAX_VALUE)
    && (filters.currency == "all" || filters.currency == i.currencyCode));

    return result;
  }
}
