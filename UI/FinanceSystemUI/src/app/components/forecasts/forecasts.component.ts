import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/HttpService/http.service';
import { Operation } from '../models/operation';
import { Chart } from 'angular-highcharts';
import { ChartService } from 'src/app/services/ChartService/chart.service';

@Component({
  selector: 'app-forecasts',
  templateUrl: './forecasts.component.html',
  styleUrls: ['./forecasts.component.css']
})
export class ForecastsComponent implements OnInit {
  naiveForecastData: KeyValue<string[], number[][]> = {key: [], value: []}
  naiveSeasonForecastData: KeyValue<string[], number[][]> = {key: [], value: []}
  MLForecastData: KeyValue<string[], number[][]> = {key: [], value: []}

  naiveChart: Chart = new Chart();
  naiveSeasonChart: Chart = new Chart();
  MLChart: Chart = new Chart();
  chartsEnabled: boolean[] = [false, false, false];
  
  constructor(
    private httpService: HttpService,
    private chartService: ChartService
  ) {}

  ngOnInit(): void {
  }

  getNaiveForecast() {
    this.chartsEnabled = this.chartsEnabled.map(ce => false);
    
    if (this.naiveForecastData.key.length != 0) 
    {
      this.chartsEnabled[0] = true;
      return;
    }

    this.httpService.getNaiveForecast().subscribe({
      next: val => {
        this.naiveForecastData = val;
        this.naiveChart = this.chartService.GenerateMultilineChart(val.key, val.value);
        this.chartsEnabled[0] = true;
      },
      error: err => alert(err.error) 
    });
  }

  getNaiveForecastWithSeasoning() {
    this.chartsEnabled = this.chartsEnabled.map(ce => false);
    
    if (this.naiveSeasonForecastData.key.length != 0) 
    {
      this.chartsEnabled[1] = true;
      return;
    }

    this.httpService.getNaiveSeasonForecast().subscribe({
      next: val => {
        this.naiveSeasonForecastData = val;
        this.naiveSeasonChart = this.chartService.GenerateMultilineChart(val.key, val.value);
        this.chartsEnabled[1] = true;
      },
      error: err => alert(err.error)      
    });
  }

  getMLForecast() {
    this.chartsEnabled = this.chartsEnabled.map(ce => false);
    
    if (this.MLForecastData.key.length != 0) 
    {
      this.chartsEnabled[2] = true;
      return;
    }

    this.httpService.getMLForecast().subscribe({
      next: val => {
        this.MLForecastData = val;
        this.MLChart = this.chartService.GenerateMultilineChart(val.key, val.value);
        this.chartsEnabled[2] = true;
      },
      error: err => alert(err.error)
    });
  }
}
