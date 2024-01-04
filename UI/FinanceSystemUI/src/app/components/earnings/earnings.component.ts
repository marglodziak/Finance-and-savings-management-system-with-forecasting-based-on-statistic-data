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
export class EarningsComponent implements OnInit{
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
    private httpService:HttpService,
    private chartService: ChartService,
    private dateService: DateService,
    private filtersService: FiltersService,
    private currenciesService: CurrenciesService,
    private earningsService: EarningsService,
    sortingService: SortingService)
  {
    this.sortingService = sortingService;
    this.todayDate = this.dateService.FormatDateToLocale(new Date());
  }

  async ngOnInit(): Promise<void> {
    this.earnings = await this.earningsService.getEarnings();
    this.totalEarnings = await this.earningsService.getEarnings();
    this.categories = await this.earningsService.getCategories();
    this.currencies = this.currenciesService.currencies;
    this.filters = this.filtersService.earningsFilters;
    this.updateCharts();
    this.sortingService.sortByDate(this.earnings);

  }

  private updateCharts() {
    this.chartService.updateEarningsCharts(this.earnings, this.totalEarnings);
    this.earningsByDaysChart = this.chartService.earningsByDaysChart;
    this.earningsByMonthsChart = this.chartService.earningsByMonthsChart;
    this.earningsByCategoryChart = this.chartService.earningsByCategoryChart;
    this.earningsByUserChart = this.chartService.earningsByUserChart;
  }

  trackByFn(index: any) {
    return index;  
  }

  sortByColumn(header: ListHeader) {
    this.sortingService.sortItems(header, this.earnings);
  }

  async filterEarnings() {
    this.earnings = await this.filtersService.filterEarnings();
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

    this.earnings = await this.earningsService.addEarnings(this.earningsInput);
    this.closeModal();
    this.updateCharts();
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
    return this.editRowsEnabled && this.earnings[index].username == "Ja";
  }

  deleteRow(index: number) {
    if (!confirm("Czy na pewno chcesz usunąć?")) {
      return;
    };

    this.earnings = this.earningsService.deleteEarning(this.earnings, index);
    this.updateCharts();
  }

  changeLineChart(position: string) {
    this.leftLineChartEnabled = position === 'left';
  }

  changePieChart(position: string) {
    this.leftPieChartEnabled = position === 'left';
  }
}
