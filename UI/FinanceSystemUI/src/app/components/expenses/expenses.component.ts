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
export class ExpensesComponent implements OnInit {

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
  }

  async ngOnInit(): Promise<void> {
    this.expenses = await this.expensesService.getExpenses();
    this.totalExpenses = await this.expensesService.getExpenses();
    this.categories = await this.expensesService.getCategories();
    this.currencies = this.currenciesService.currencies;
    this.filters = this.filtersService.expensesFilters;
    this.updateCharts();
    this.sortingService.sortByDate(this.expenses);
  }

  private updateCharts() {
    this.chartService.updateExpensesCharts(this.expenses, this.totalExpenses);
    this.expensesByDaysChart = this.chartService.expensesByDaysChart;
    this.expensesByMonthsChart = this.chartService.expensesByMonthsChart;
    this.expensesByCategoryChart = this.chartService.expensesByCategoryChart;
    this.expensesByUserChart = this.chartService.expensesByUserChart;
  }

  trackByFn(index: any) {
    return index;  
  }

  sortByColumn(header: ListHeader) {
    this.sortingService.sortItems(header, this.expenses);
  }

  async filterExpenses() {
    this.expenses = await this.filtersService.filterExpenses();
    this.updateCharts();
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
    this.addRow();
    this.inputModalDisabled = false;
    // this.earningsInput = [];
    // this.addRow();
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
      alert("invalid");
      return;
    }

    alert("valid");

    let test = this.httpService.addExpense(JSON.stringify(this.earningsInput)).subscribe();
    this.earningsReceived = this.earningsReceived.concat(this.earningsInput);
    // this.ResetInput();
    // this.sortItems(this.sortingService.listHeaders.find(h => h.arrowDirection != 0)!);
  }

  IsInputValid() {
    let invalidItems = this.earningsInput
    .filter( e => {
      let k = parseFloat(e.value.toLocaleString());
      return Number.isNaN(k);
    });

    return invalidItems.length == 0;
  }

  private ResetInput()
  {
    this.earningsInput = [this.CreateInputRow()];
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

    let expenseId = this.expenses[index].id;
    this.httpService.deleteExpense(expenseId).subscribe();
  }

  changeLineChart(position: string) {
    this.leftLineChartEnabled = position === 'left';
  }

  changePieChart(position: string) {
    this.leftPieChartEnabled = position === 'left';
  }
}

