import { Injectable } from '@angular/core';
import { Filters } from 'src/app/components/models/filters';
import { EarningsService } from '../EarningsService/earnings.service';
import { ExpensesService } from '../ExpensesService/expenses.service';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  earningsFilters: Filters;
  expensesFilters: Filters;
  
  constructor(
    private earningsService: EarningsService,
    private expensesService: ExpensesService
  ) {
    this.earningsFilters = this.buildEarningsFilters();
    this.expensesFilters = this.buildExpensesFilters();
  }

  private buildEarningsFilters() {
    var filters = new Filters();

    filters.startDate = this.earningsService.getStartDate();
    filters.endDate = this.earningsService.getEndDate();
    filters.maxValue = this.earningsService.getMaxEearningValue();

    return filters;
  }

  private buildExpensesFilters() {
    var filters = new Filters();

    filters.startDate = this.expensesService.getStartDate();
    filters.endDate = this.expensesService.getEndDate();
    filters.maxValue = this.expensesService.getMaxExpenseValue();

    return filters;
  }

  async filterEarnings() {
    let startDate = new Date(this.earningsFilters.startDate + "T00:00:00");
    let endDate = new Date(this.earningsFilters.endDate + "T00:00:00");
    let earnings = await this.earningsService.getEarnings();

    return earnings.filter(e => 
       (startDate <= new Date(e.date) && new Date(e.date) <= endDate)
    && (this.earningsFilters.category == "all" || this.earningsFilters.category == e.category)
    && (this.earningsFilters.minValue.toString() != "" ? this.earningsFilters.minValue <= e.value : 0 <= e.value)
    && (this.earningsFilters.maxValue.toString() != "" ? this.earningsFilters.maxValue >= e.value : e.value < Number.MAX_VALUE)
    && (this.earningsFilters.currency == "all" || this.earningsFilters.currency == e.currencyCode));
  }

  async filterExpenses() {
    let startDate = new Date(this.expensesFilters.startDate + "T00:00:00");
    let endDate = new Date(this.expensesFilters.endDate + "T00:00:00");
    let expenses = await this.expensesService.getExpenses();

    return expenses.filter(e => 
       (startDate <= new Date(e.date) && new Date(e.date) <= endDate)
    && (this.expensesFilters.category == "all" || this.expensesFilters.category == e.category)
    && (this.expensesFilters.minValue.toString() != "" ? this.expensesFilters.minValue <= e.value : 0 <= e.value)
    && (this.expensesFilters.maxValue.toString() != "" ? this.expensesFilters.maxValue >= e.value : e.value < Number.MAX_VALUE)
    && (this.expensesFilters.currency == "all" || this.expensesFilters.currency == e.currencyCode));
  }
}
