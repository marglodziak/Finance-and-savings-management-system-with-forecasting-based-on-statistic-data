import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/HttpService/http.service';
import { Earning } from '../models/earning';
import { ListHeader } from '../models/listHeader';
import { Filters } from '../models/filters';
import { Chart } from 'angular-highcharts';
import { ChartService } from 'src/app/services/ChartService/chart.service';
import { DateService } from 'src/app/services/DateService/date.service';
import { lastValueFrom } from 'rxjs';
import { ExchangeRate } from '../models/exchangeRate';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent implements OnInit{
  categories: string[] = [];
  exchangeRates: ExchangeRate[] = [];
  earningsInput: Earning[] = [];
  earningsReceived: Earning[] = [];
  earningsToShow: Earning[] = [];
  listHeaders: ListHeader[] = [
    new ListHeader("Użytkownik", 0),
    new ListHeader("Data", -1),
    new ListHeader("Kategoria", 0),
    new ListHeader("Opis", 0),
    new ListHeader("Wartość", 0),
    new ListHeader("Waluta", 0),
    new ListHeader("PLN", 0)
  ]
  filters: Filters;
  earningHistoryChart: Chart = new Chart();
  earningsByCategoryChart: Chart = new Chart();

  addRowDisabled: boolean = true;
  modalDisabled: boolean = true;
  deleteRowEnabled: boolean = false;
  totalValue: string = "";
  exchangeRateSelected: string = "PLN";

  constructor(
    private httpService:HttpService,
    private chartService: ChartService,
    private dateService: DateService)
  {
    let monthEarlierDate = this.dateService.GetMonthEarlierDate();
    let monthEarlierDateFormatted = this.dateService.FormatDateToLocale(monthEarlierDate);
    let currentDateFormatted = this.dateService.FormatDateToLocale(new Date());

    this.filters = new Filters(monthEarlierDateFormatted, currentDateFormatted, "", 0, 1000, 20);
  }

  async ngOnInit(): Promise<void> {
    await this.GetExchangeRates();
    await this.GetEarnings();
    await this.GetEarningsCategories();
    this.addRow();
    this.UpdateCharts();
    this.sortItems(this.listHeaders[0]);
    this.filters.category = this.categories[0];
  }

  private async GetExchangeRates() {
    this.exchangeRates = await lastValueFrom(this.httpService.getExchangeRates());
  }

  private async GetEarnings() {
    let response = await lastValueFrom(this.httpService.getEarnings());
    response.forEach(r => {
      r.date = r.date.substring(0, 10);
      r.value = r.value.toFixed(2);
    });
    this.earningsReceived = response;
    this.earningsToShow = this.earningsReceived.slice(0, Math.min(response.length, this.filters.numberOfItems));
  }

  valueAfterExchange(earning: Earning) {
    let currency = this.exchangeRates.find(er => er.currencyCode == earning.currencyCode); 
    return (currency!.currentExchangeRate * earning.value).toFixed(2);
  }

  private async GetEarningsCategories() {
    this.categories = await lastValueFrom(this.httpService.getEarningCategories());
  }

  private UpdateCharts() {
    let dates = this.dateService.GetDatesInRange(this.filters.startDate, this.filters.endDate);
    let earningValues = this.chartService.FormatEarningValuesInTime(dates, this.earningsToShow);
    let earningsByCategory = this.chartService.CalculateEarningsByCategory(this.earningsToShow);

    this.earningHistoryChart = this.chartService.GenerateLineChart("Ostatnie wpływy", dates, earningValues);
    this.earningsByCategoryChart = this.chartService.GeneratePieChart("Ostatnie wpływy", dates, earningsByCategory);

    this.totalValue = this.earningsToShow.map(e => parseFloat(e.currentValueInPLN)).reduce((a,b) => a+b).toFixed(2);
  }

  trackByFn(index: any) {
    return index;  
  }

  changeSortColumn(header: ListHeader) {
    this.changeArrowDirection(header);
    this.sortItems(header);
  }

  private changeArrowDirection(header: ListHeader) {
    if (header.arrowDirection != 0) {
      header.arrowDirection *= -1;
    }
    else {
      this.listHeaders.forEach(h => h.arrowDirection = 0);
      header.arrowDirection = -1;
    }    
  }

  private sortItems(header: ListHeader) {
    switch(header.name) {
      case this.listHeaders[0].name:
        this.earningsToShow = this.earningsToShow.sort((a,b) => Number(new Date(b.date)) - Number(new Date(a.date)));
        break;
      case this.listHeaders[1].name:
        this.earningsToShow = this.earningsToShow.sort((a,b) => a.category.localeCompare(b.category));
        break;
      default:
        this.earningsToShow = this.earningsToShow.sort((a,b) => b.value - a.value);
        break;
    }

    if (header.arrowDirection == 1) {
      this.earningsToShow = this.earningsToShow.reverse();
    }
  }

  filterEarnings() {
    this.SelectEarningItems();
    this.UpdateCharts();
  }

  private SelectEarningItems() {
      this.earningsToShow = this.earningsReceived.filter(e => 
       (this.filters.startDate <= e.date && e.date <= this.filters.endDate)
    && (this.filters.category == "" || this.filters.category == e.category)
    && (this.filters.minValue != null ? this.filters.minValue <= e.value : 0 <= e.value)
    && (this.filters.maxValue != null ? this.filters.maxValue >= e.value : e.value < Number.MAX_VALUE));

    this.earningsToShow = this.earningsToShow.slice(0, Math.min(this.earningsToShow.length, this.filters.numberOfItems));
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
    this.modalDisabled = false;
    // this.earningsInput = [];
    // this.addRow();
  }

  closeModal() {
    this.modalDisabled = true;
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

    let test = this.httpService.addEarning(JSON.stringify(this.earningsInput)).subscribe();
    this.earningsReceived = this.earningsReceived.concat(this.earningsInput);
    // this.ResetInput();
    this.sortItems(this.listHeaders.find(h => h.arrowDirection != 0)!);
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
    return new Earning("Ja", this.dateService.FormatDateToLocale(new Date()), this.categories[0], "", "0.00", "PLN", "0.00");
  }

  LetDeleteRows() {
    this.deleteRowEnabled = !this.deleteRowEnabled;
  }

  DeleteRow() {
    if (!confirm("Czy na pewno chcesz usunąć?")) {
      return;
    };

    alert('deleted');
  }
}
