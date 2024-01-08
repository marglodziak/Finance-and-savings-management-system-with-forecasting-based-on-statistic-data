import { Injectable } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DateService } from '../DateService/date.service';
import { Operation } from 'src/app/components/models/operation';
import { FiltersService } from '../FiltersService/filters.service';
import { ExpensesService } from '../ExpensesService/expenses.service';
import { BehaviorSubject } from 'rxjs';
import { EarningsService } from '../EarningsService/earnings.service';
import { SortingService } from '../SortingService/sorting.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  baseCategoryColor: string = '#00542c';
  baseColorR: number;
  baseColorG: number;
  baseColorB: number;

  earningsByDaysChannel: BehaviorSubject<Chart> = new BehaviorSubject(new Chart);
  earningsByMonthsChannel: BehaviorSubject<Chart> = new BehaviorSubject(new Chart);
  earningsByCategoryChannel: BehaviorSubject<Chart> = new BehaviorSubject(new Chart);
  earningsByUserChannel: BehaviorSubject<Chart> = new BehaviorSubject(new Chart);

  expensesByDaysChannel: BehaviorSubject<Chart> = new BehaviorSubject(new Chart);
  expensesByMonthsChannel: BehaviorSubject<Chart> = new BehaviorSubject(new Chart);
  expensesByCategoryChannel: BehaviorSubject<Chart> = new BehaviorSubject(new Chart);
  expensesByUserChannel: BehaviorSubject<Chart> = new BehaviorSubject(new Chart);

  earnings: Operation[] = [];
  expenses: Operation[] = [];
  totalEarnings: Operation[] = [];
  totalExpenses: Operation[] = [];

  
  constructor(
    private dateService: DateService,
    private filtersService: FiltersService,
    private earningsService: EarningsService,
    private expensesService: ExpensesService,
    private sortingService: SortingService
  ) {
    this.baseColorR = parseInt(this.baseCategoryColor.substring(1, 3), 16);
    this.baseColorG = parseInt(this.baseCategoryColor.substring(3, 5), 16);
    this.baseColorB = parseInt(this.baseCategoryColor.substring(5), 16);

    this.filtersService.filteredEarningsChannel.subscribe(e => {
      this.earnings = JSON.parse(JSON.stringify(e));
      this.updateEarningsCharts(this.earnings, this.totalEarnings);
    })

    this.filtersService.filteredExpensesChannel.subscribe(e => {
      this.expenses = JSON.parse(JSON.stringify(e));
      this.updateExpensesCharts(this.expenses, this.totalExpenses);
    })
    
    this.earningsService.earningsChannel.subscribe(e => this.totalEarnings = JSON.parse(JSON.stringify(e)));
    this.expensesService.expensesChannel.subscribe(e => this.totalExpenses = JSON.parse(JSON.stringify(e)));
  }

  //#region Logic

  getBalanceHistoryChart(earnings: Operation[], expenses: Operation[]) {
    let expensesCopy: Operation[] = JSON.parse(JSON.stringify(expenses));
    expensesCopy.forEach(e => e.currentValueInPLN *= -1);

    let values = earnings.concat(expensesCopy);
    let valuesSorted = this.sortingService.sortByDateAsc(values);
    let dates = this.dateService.GetDatesInRange(valuesSorted[0].date, valuesSorted.at(-1)!.date);
    let history = this.FormatEarningValuesInTime(dates, valuesSorted);
    
    return this.GenerateLineChart(dates.map(c => c.toLocaleDateString()), history);
  }

  getExpensesChart(expenses: Operation[]) {
    let expensesCopy: Operation[] = JSON.parse(JSON.stringify(expenses));
    let valuesSorted = this.sortingService.sortByDateAsc(expensesCopy);
    let dates = this.dateService.GetDatesInRange(valuesSorted[0].date, valuesSorted.at(-1)!.date);
    let history = this.FormatEarningValuesInTime(dates, valuesSorted);
    
    return this.GenerateLineChart(dates.map(c => c.toLocaleDateString()), history);
  }

  getEarningsChart(expenses: Operation[]) {
    let earningsCopy: Operation[] = JSON.parse(JSON.stringify(expenses));
    let valuesSorted = this.sortingService.sortByDateAsc(earningsCopy);
    let dates = this.dateService.GetDatesInRange(valuesSorted[0].date, valuesSorted.at(-1)!.date);
    let history = this.FormatEarningValuesInTime(dates, valuesSorted);
    
    return this.GenerateLineChart(dates.map(c => c.toLocaleDateString()), history);
  }

  updateEarningsCharts(earnings: Operation[], totalEarnings: Operation[]) {
    let filters = this.filtersService.earningsFilters;
    let dates = this.dateService.GetDatesInRange(filters.startDate, filters.endDate);
    let months = this.dateService.GetMonthsInRange(filters.startDate, filters.endDate);
    let earningValues = this.FormatEarningValuesInTime(dates, earnings);
    let selectedEarningsByMonths = this.CalculateEarningsByMonth(months, earnings);
    let totalEarningsByMonths = this.CalculateEarningsByMonth(months, totalEarnings);
    let earningsByCategory = this.CalculateEarningsByCategory(earnings);
    let earningsByUser = this.CalculateEarningsByUser(earnings);

    let earningsByDaysChart = this.GenerateLineChart(dates.map(c => c.toLocaleDateString()), earningValues);
    let earningsByMonthsChart = this.GenerateBarChart(months.map(m => m.substring(0, 3) + m.substring(5)), selectedEarningsByMonths, totalEarningsByMonths);
    let earningsByCategoryChart = this.GeneratePieChart(earningsByCategory);
    let earningsByUserChart = this.GeneratePieChart(earningsByUser);

    this.earningsByDaysChannel.next(earningsByDaysChart);
    this.earningsByMonthsChannel.next(earningsByMonthsChart);
    this.earningsByCategoryChannel.next(earningsByCategoryChart);
    this.earningsByUserChannel.next(earningsByUserChart);
  }

  updateExpensesCharts(expenses: Operation[], totalExpenses: Operation[]) {
    let filters = this.filtersService.expensesFilters;
    let dates = this.dateService.GetDatesInRange(filters.startDate, filters.endDate);
    let months = this.dateService.GetMonthsInRange(filters.startDate, filters.endDate);
    let earningValues = this.FormatEarningValuesInTime(dates, expenses);
    let selectedEarningsByMonths = this.CalculateEarningsByMonth(months, expenses);
    let totalEarningsByMonths = this.CalculateEarningsByMonth(months, totalExpenses);
    let earningsByCategory = this.CalculateEarningsByCategory(expenses);
    let earningsByUser = this.CalculateEarningsByUser(expenses);

    let expensesByDaysChart = this.GenerateLineChart(dates.map(c => c.toLocaleDateString()), earningValues);
    let expensesByMonthsChart = this.GenerateBarChart(months.map(m => m.substring(0, 3) + m.substring(5)), selectedEarningsByMonths, totalEarningsByMonths);
    let expensesByCategoryChart = this.GeneratePieChart(earningsByCategory);
    let expensesByUserChart = this.GeneratePieChart(earningsByUser);

    this.expensesByDaysChannel.next(expensesByDaysChart);
    this.expensesByMonthsChannel.next(expensesByMonthsChart);
    this.expensesByCategoryChannel.next(expensesByCategoryChart);
    this.expensesByUserChannel.next(expensesByUserChart);
  }

  FormatEarningValuesInTime(dates: Date[], earnings: Operation[]) {
    let values: number[] = Array(dates.length).fill(0);
    let currentDateIndex = 0;
    let currentEarningIndex = 0;
    let earningsSortedAsc = earnings.sort((a,b) => new Date(a.date) > new Date(b.date) ? 1 : -1);

    while (currentEarningIndex < earnings.length && currentDateIndex < dates.length) {
      let currentDate = this.dateService.FormatDateToLocale(dates[currentDateIndex]);
      let earningDate = earningsSortedAsc[currentEarningIndex].date;
      if (currentDate != earningDate) {
        currentDateIndex += 1;
      }
      else {
        values[currentDateIndex] += parseFloat(earningsSortedAsc[currentEarningIndex].currentValueInPLN);
        currentEarningIndex += 1;
      }
    }

    return values.map(v => Number(v.toFixed(2)));
  }

  CalculateEarningsByMonth(months: string[], earnings: Operation[], ) {
    let values: number[] = Array(months.length).fill(0);
    let currentEarningIndex = 0;
    let earningsSortedAsc = earnings.sort((a,b) => new Date(a.date) > new Date(b.date) ? 1 : -1);

    for (let i=0; i<months.length && currentEarningIndex<earnings.length; i++) {
      let currentDate = new Date(earningsSortedAsc[currentEarningIndex].date);
      let currentMonth = parseInt(months[i].substring(0, 2));
      let currentYear = parseInt(months[i].substring(3));

      while (currentEarningIndex < earnings.length
              && currentDate.getMonth()+1 === currentMonth
              && currentDate.getFullYear() === currentYear) {
        values[i] += parseFloat(earningsSortedAsc[currentEarningIndex].currentValueInPLN);
        currentEarningIndex += 1;
        
        if (currentEarningIndex < earnings.length) {
          currentDate = new Date(earningsSortedAsc[currentEarningIndex].date);
        }
      }
    }

    return values.map(v => Number(v.toFixed(2)));
  }

  CalculateEarningsByCategory(earnings: Operation[]) {
    let uniqueCategories = earnings.map(e => e.category).filter((value, index, self) => self.indexOf(value) === index);
    let colors = this.GetCategoriesColors(uniqueCategories.length);
    let data: object[] = [];

    for (let i=0; i<uniqueCategories.length; i++) {
      let category = uniqueCategories[i];

      let categoryEntries = earnings.filter(e => e.category == category);
      let totalValue = categoryEntries
        .map(e => parseFloat(e.currentValueInPLN))
        .reduce((a,b) => a+b);

      data.push( {name: category, y: Number(totalValue.toFixed(2)), color: colors[i]} )
    };

    return data;
  }

  CalculateEarningsByUser(earnings: Operation[]) {
    let uniqueUsers = earnings.map(e => e.username).filter((value, index, self) => self.indexOf(value) === index);
    let colors = this.GetCategoriesColors(uniqueUsers.length);
    let data: object[] = [];

    for (let i=0; i<uniqueUsers.length; i++) {
      let user = uniqueUsers[i];

      let userEntries = earnings.filter(e => e.username == user);
      let totalValue = userEntries
        .map(e => parseFloat(e.currentValueInPLN))
        .reduce((a,b) => a+b);

      data.push( {name: user, y: Number(totalValue.toFixed(2)), color: colors[i]} )
    };

    return data;
  }

  private GetCategoriesColors(n: number) {
    let colors: string[] = Array(n).fill('');
    let colorStepR = Math.round((255-this.baseColorR) / n) - 1;
    let colorStepG = Math.round((255-this.baseColorG) / n) - 1;
    let colorStepB = Math.round((255-this.baseColorB) / n) - 1;

    for (let i=0; i<n; i++) {
      let stepR = this.baseColorR + i*colorStepR;
      let stepG = this.baseColorG + i*colorStepG;
      let stepB = this.baseColorB + i*colorStepB;

      colors[i] = 
        '#' +
        stepR.toString(16).padStart(2, '0') +
        stepG.toString(16).padStart(2, '0') +
        stepB.toString(16).padStart(2, '0');
    }

    return colors;
  }

  //#endregion

  //#region ChartGenerators

  GenerateLineChart(categories: string[], data: number[]) {
    return new Chart({
      chart: {
        type: 'line',
        backgroundColor: '#3b3b3b'
      },
      title: {
        text: ""
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: categories,
        labels: {
          enabled: false,
        },
        lineColor: '#b3b3b3'
      },
      yAxis: {
        title: {
          text: undefined
        },
        labels: {
          style: {
            fontSize: '0.6rem',
            color: '#f6fffa'
          }
        },
        tickAmount: 6,
        gridLineColor: '#b3b3b3'
      },
      series: [
        {
          showInLegend: false,
          name: "Wpływy",
          type: "spline",
          color: "#63b83f",
          data: data
        }
      ]
    })
  }

  GenerateMultilineChart(categories: string[], data: number[][]) {
    return new Chart({
      chart: {
        type: 'line',
        backgroundColor: '#3b3b3b'
      },
      title: {
        text: ""
      },
      credits: {
        enabled: false
      },
      legend: {
        itemStyle: {
          color: '#f6fffa'
        }
      },
      xAxis: {
        categories: categories,
        labels: {
          enabled: false,
        },
        lineColor: '#b3b3b3'
      },
      yAxis: {
        title: {
          text: undefined
        },
        labels: {
          style: {
            fontSize: '0.6rem',
            color: '#f6fffa'
          }
        },
        tickAmount: 6,
        gridLineColor: '#b3b3b3'
      },
      series: [
        {
          name: "Prognoza",
          type: "line",
          color: "#c9fe9f",
          data: data[1]
        },
        {
          name: "Saldo",
          type: "line",
          color: "#63b83f",
          data: data[0]
        }
      ]
    })
  }

  GenerateBarChart(categories: string[], dataSelected: number[], dataTotal: number[]) {
    return new Chart({
      chart: {
        type: 'column',
        backgroundColor: '#3b3b3b',
      },
      title: {
        text: ""
      },
      legend: {
        itemStyle: {
          color: '#f6fffa'
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          grouping: false
        }
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            fontSize: '0.65rem',
            color: '#f6fffa'
          } 
        },
        lineColor: '#b3b3b3'
      },
      yAxis: {
        title: {
          text: undefined
        },
        labels: {
          style: {
            fontSize: '0.6rem',
            color: '#f6fffa'
          }
        },
        tickAmount: 6,
        gridLineColor: '#b3b3b3'
      },
      series: [
        {
          type: "column",
          data: dataTotal,
          name: "Całkowite",
          color: '#c9fe9f',
          borderColor: '#c9fe9f'
        },
        {
          type: "column",
          data: dataSelected,
          name: "Wybrane",
          color: '#63b83f',
          borderColor: '#63b83f'
        }
      ]
    })
  }

  GeneratePieChart(data: object[]) {
    return new Chart({
      chart: {
        type: 'pie',
        backgroundColor: '#3b3b3b'
      },
      title: {
        text: ""
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderColor: '#3b3b3b',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  textOutline: undefined
                }
            }
        }
    },
      series: [
        {
          name: "Wpływy",
          type: "pie",
          data: data
        }
      ]
    })
  }

  //#endregion
}
