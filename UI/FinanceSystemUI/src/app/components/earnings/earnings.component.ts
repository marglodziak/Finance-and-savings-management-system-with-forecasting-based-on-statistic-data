import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/HttpService/http.service';
import { Operation } from '../models/operation';
import { ListHeader } from '../models/listHeader';
import { Filters } from '../models/filters';
import { Chart } from 'angular-highcharts';
import { ChartService } from 'src/app/services/ChartService/chart.service';
import { DateService } from 'src/app/services/DateService/date.service';
import { SortingService } from 'src/app/services/SortingService/sorting.service';
import { FiltersService } from 'src/app/services/FiltersService/filters.service';
import { CurrenciesService } from 'src/app/services/CurrenciesService/currencies.service';
import { EarningsService } from 'src/app/services/EarningsService/earnings.service';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent{
  earnings: Operation[] = [];
  totalEarnings: Operation[] = [];
  categories: string[] = [];
  currencies: string[] = [];
  filters: Filters = new Filters();
  earningsInput: Operation[] = [];
  earningsReceived: Operation[] = [];
  earningSelected: Operation | null = null;

  earningsByDaysChart: Chart = new Chart();
  earningsByMonthsChart: Chart = new Chart();
  earningsByCategoryChart: Chart = new Chart();
  earningsByUserChart: Chart = new Chart();

  addRowDisabled: boolean = true;
  inputModalDisabled: boolean = true;
  earningDetailsModalDisabled: boolean = true;
  editRowsEnabled: boolean = false;
  leftLineChartEnabled: boolean = true;
  leftPieChartEnabled: boolean = true;
  totalValue: string = "";
  todayDate: string;

  sortingService: SortingService;

  constructor(
    private chartService: ChartService,
    private dateService: DateService,
    private filtersService: FiltersService,
    private currenciesService: CurrenciesService,
    private earningsService: EarningsService,
    sortingService: SortingService)
  {
    this.sortingService = sortingService;
    this.todayDate = this.dateService.FormatDateToLocale(new Date());
    this.earningsService.earningsChannel.subscribe(e => this.totalEarnings = e);
    this.earningsService.categoriesChannel.subscribe(c => this.categories = c);
    this.currenciesService.currenciesChannel.subscribe(c => this.currencies = c);
    this.filtersService.earningFiltersChannel.subscribe(f => this.filters = f);
    this.filtersService.filteredEarningsChannel.subscribe(e => this.earnings = e);
    
    this.chartService.earningsByDaysChannel.subscribe(c => this.earningsByDaysChart = c);
    this.chartService.earningsByMonthsChannel.subscribe(c => this.earningsByMonthsChart = c);
    this.chartService.earningsByCategoryChannel.subscribe(c => this.earningsByCategoryChart = c);
    this.chartService.earningsByUserChannel.subscribe(c => this.earningsByUserChart = c);

    this.earningsService.getEarnings();
    this.earningsService.getCategories();
    this.currenciesService.getCurrencies();
    this.filtersService.getFilteredEarnings();
  }

  trackByFn(index: any) {
    return index;  
  }

  sortByColumn(header: ListHeader) {
    this.sortingService.sortItems(header, this.earnings);
  }

  filterEarnings() {
    this.filtersService.getFilteredEarnings();
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

  async submitInput()
  {
    if (!this.IsInputValid())
    {
      alert("Podano niepoprawne dane");
      return;
    }

    this.earningsService.addEarnings(this.earningsInput);
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
    return this.editRowsEnabled && this.earnings[index].username == "Ja";
  }

  deleteRow(index: number) {
    if (!confirm("Czy na pewno chcesz usunąć?")) {
      return;
    };

    this.earningsService.deleteEarning(this.earnings, index);
  }

  changeLineChart(position: string) {
    this.leftLineChartEnabled = position === 'left';
  }

  changePieChart(position: string) {
    this.leftPieChartEnabled = position === 'left';
  }
}
