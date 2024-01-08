import { Component, OnInit } from '@angular/core';
import { DashboardCategory } from '../models/dashboardCategory';
import { Operation } from '../models/operation';
import { EarningsService } from 'src/app/services/EarningsService/earnings.service';
import { ExpensesService } from 'src/app/services/ExpensesService/expenses.service';
import { Chart } from 'angular-highcharts';
import { ChartService } from 'src/app/services/ChartService/chart.service';

@Component({
  selector: 'app-main-site',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  categories: DashboardCategory[] = [
    new DashboardCategory("Saldo", true),
    new DashboardCategory("Wydatki", false),
    new DashboardCategory("Wpływy", false)
  ]

  balanceChart: Chart = new Chart();
  expensesChart: Chart = new Chart();
  earningsChart: Chart = new Chart();

  selectedCategory: DashboardCategory = this.categories[0];
  earnings: Operation[] = [];
  expenses: Operation[] = [];

  constructor(
    private earningsService: EarningsService,
    private expensesService: ExpensesService,
    private chartsService: ChartService
  ) {    
    this.earningsService.earningsChannel.subscribe(e => {
      this.earnings = e;
      this.calculateTotals();
    });
    this.expensesService.expensesChannel.subscribe(e => {
      this.expenses = e;
      this.calculateTotals();
    });    
    
    this.earningsService.getEarnings();
    this.expensesService.getExpenses();
  }

  private calculateTotals() {
    this.calculateEarnings();
    this.calculateExpenses();
    this.calculateBalance();

    this.getCharts();
  }

  private calculateEarnings() {
    if (this.earnings.length == 0) {
      return;
    }

    let category = this.categories[2];

    category.sum = this.sumItems(this.earnings);
    category.averageNumberOfOperations = this.calculateAverageNumberOfOperations(this.earnings);
    category.minValue = this.findMinValue(this.earnings);
    category.averageValue = (Number(category.sum) / this.earnings.length).toFixed(2);
    category.maxValue = this.findMaxValue(this.earnings);
  }

  private calculateExpenses() {
    if (this.expenses.length == 0) {
      return;
    }

    let category = this.categories[1];

    category.sum = this.sumItems(this.expenses);
    category.averageNumberOfOperations = this.calculateAverageNumberOfOperations(this.expenses);
    category.minValue = this.findMinValue(this.expenses);
    category.averageValue = (Number(category.sum) / this.expenses.length).toFixed(2);
    category.maxValue = this.findMaxValue(this.expenses);
  }

  private calculateBalance() {
    let category = this.categories[0];

    category.sum = (Number(this.categories[2].sum) - Number(this.categories[1].sum)).toFixed(2);
    category.averageNumberOfOperations = this.calculateAverageNumberOfOperations(this.earnings, this.expenses);
    category.minValue = Math.min(Number(this.categories[1].minValue), Number(this.categories[2].minValue)).toFixed(2);
    category.averageValue = (Number(category.sum) / (this.earnings.concat(this.expenses)).length).toFixed(2);
    category.maxValue = Math.max(Number(this.categories[1].maxValue), Number(this.categories[2].maxValue)).toFixed(2);
  }

  private sumItems(items: Operation[]) {
    return items.map(e => e.currentValueInPLN).reduce((a,b) => { return a+b }, 2).toFixed(2);
  }

  private calculateAverageNumberOfOperations(items: Operation[], secondaryItems:Operation[] = []) {
    let values = items.concat(secondaryItems);
    let startDate = values.map(e => e.date).reduce((a,b) => new Date(a) < new Date(b) ? a : b);
    let totalDays = (new Date().getTime() - new Date(startDate).getTime()) / (1000 * 3600 *24);

    return (values.length / Math.ceil(totalDays)).toFixed(3);
  }

  private findMinValue(items: Operation[]) {
    return items.map(i => i.currentValueInPLN).reduce((a,b) => a < b ? a : b);
  }

  private findMaxValue(items: Operation[]) {
    return items.map(i => i.currentValueInPLN).reduce((a,b) => a > b ? a : b);
  }

  getCharts() {
    if (this.earnings.length == 0 || this.expenses.length == 0) {
      return;
    }

    this.balanceChart = this.chartsService.getBalanceHistoryChart(this.earnings, this.expenses);
    this.expensesChart = this.chartsService.getExpensesChart(this.expenses);
    this.earningsChart = this.chartsService.getEarningsChart(this.earnings);
  }

  activateCategory(category: DashboardCategory) {
    this.categories.forEach(c => c.isActive = false);
    category.isActive = true;
    this.selectedCategory = category;
  }
}
