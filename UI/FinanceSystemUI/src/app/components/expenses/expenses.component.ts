import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/HttpService/http.service';
import { Operation } from '../models/operation';
import { Filters } from '../models/filters';
import { Chart } from 'angular-highcharts';
import { ChartService } from 'src/app/services/ChartService/chart.service';
import { DateService } from 'src/app/services/DateService/date.service';
import { SortingService } from 'src/app/services/SortingService/sorting.service';
import { ExpensesService } from 'src/app/services/ExpensesService/expenses.service';
import { CurrenciesService } from 'src/app/services/CurrenciesService/currencies.service';
import { FiltersService } from 'src/app/services/FiltersService/filters.service';
import { ListHeader } from '../models/listHeader';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {

  expenses: Operation[] = [];
  totalExpenses: Operation[] = [];
  categories: string[] = [];
  currencies: string[] = [];
  filters: Filters = new Filters();
  earningsInput: Operation[] = [];
  earningsReceived: Operation[] = [];
  earningSelected: Operation | null = null;

  expensesByDaysChart: Chart = new Chart();
  expensesByMonthsChart: Chart = new Chart();
  expensesByCategoryChart: Chart = new Chart();
  expensesByUserChart: Chart = new Chart();

  addRowDisabled: boolean = true;
  inputModalDisabled: boolean = true;
  earningDetailsModalDisabled: boolean = true;
  editRowsEnabled: boolean = false;
  leftLineChartEnabled: boolean = true;
  leftPieChartEnabled: boolean = true;
  totalValue: string = "";

  sortingService: SortingService;

  constructor(
    private httpService:HttpService,
    private chartService: ChartService,
    private dateService: DateService,
    private filtersService: FiltersService,
    private currenciesService: CurrenciesService,
    private expensesService: ExpensesService,
    sortingService: SortingService)
  {
    this.sortingService = sortingService;
    this.expensesService.expensesChannel.subscribe(e => this.totalExpenses = e);
    this.expensesService.categoriesChannel.subscribe(c => this.categories = c);
    this.currenciesService.currenciesChannel.subscribe(c => this.currencies = c);
    this.filtersService.expenseFiltersChannel.subscribe(f => this.filters = f);
    this.filtersService.filteredExpensesChannel.subscribe(e => this.expenses = e);
    
    this.chartService.expensesByDaysChannel.subscribe(c => this.expensesByDaysChart = c);
    this.chartService.expensesByMonthsChannel.subscribe(c => this.expensesByMonthsChart = c);
    this.chartService.expensesByCategoryChannel.subscribe(c => this.expensesByCategoryChart = c);
    this.chartService.expensesByUserChannel.subscribe(c => this.expensesByUserChart = c);

    this.expensesService.getExpenses();
    this.expensesService.getCategories();
    this.currenciesService.getCurrencies();
    this.filtersService.getFilteredExpenses();
  }

  trackByFn(index: any) {
    return index;  
  }

  sortByColumn(header: ListHeader) {
    this.sortingService.sortItems(header, this.expenses);
  }

  filterExpenses() {
    this.filtersService.getFilteredExpenses();
  }
  
  onChange(value: any)
  {
    let currentEarning = this.earningsInput.at(-1);
    if (currentEarning?.value != 0 && currentEarning?.category != "")
    {
      this.addRowDisabled = false;
    }    
  }

  openModal() {
    this.earningsInput = [];
    this.addRow();
    this.inputModalDisabled = false;
  }

  closeModal() {
    this.inputModalDisabled = true;
    this.earningDetailsModalDisabled = true;
  }

  addRow()
  {
    this.earningsInput.push(this.CreateInputRow());
    this.addRowDisabled = true;
  }

  submitInput()
  {
    if (!this.IsInputValid())
    {
      alert("Podano niepoprawne dane");
      return;
    }

    this.expensesService.addExpenses(this.earningsInput);
    this.closeModal();
  }

  IsInputValid() {
    let invalidItems = this.earningsInput
    .filter( e => {
      let k = parseFloat(e.value.toLocaleString());
      return Number.isNaN(k);
    });

    return invalidItems.length == 0;
  }

  private CreateInputRow()
  {
    return new Operation(-1, "Ja", this.dateService.FormatDateToLocale(new Date()), this.categories[0], "", "0.00", "PLN", "0.00");
  }

  showEarningDetails(earning: Operation) {
    this.earningSelected = earning;
    this.earningDetailsModalDisabled = false;
  }

  LetDeleteRows() {
    this.editRowsEnabled = !this.editRowsEnabled;
  }

  deleteRowEnabled(index: number) {
    return this.editRowsEnabled && this.expenses[index].username == "Ja";
  }

  deleteRow(index: number) {
    if (!confirm("Czy na pewno chcesz usunąć?")) {
      return;
    };

    this.expensesService.deleteExpense(this.expenses, index);
  }

  changeLineChart(position: string) {
    this.leftLineChartEnabled = position === 'left';
  }

  changePieChart(position: string) {
    this.leftPieChartEnabled = position === 'left';
  }
}
