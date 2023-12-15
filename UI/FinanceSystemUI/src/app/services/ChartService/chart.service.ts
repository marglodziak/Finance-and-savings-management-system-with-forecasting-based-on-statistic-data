import { Injectable } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DateService } from '../DateService/date.service';
import { Earning } from 'src/app/components/models/earning';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(private dateService: DateService) { }

  FormatEarningValuesInTime(dates: string[], earnings: Earning[]) {
    let values: number[] = Array(dates.length).fill(0);
    let currentDateIndex = 0;
    let currentEarningIndex = 0;
    let earningsSortedAsc = earnings.sort((a,b) => Number(new Date(a.date)) - Number(new Date(b.date)));

    while (currentEarningIndex < earnings.length && currentDateIndex < dates.length) {
      if (earningsSortedAsc[currentEarningIndex].date != dates[currentDateIndex]) {
        currentDateIndex += 1;
      }
      else {
        values[currentDateIndex] += parseFloat(earningsSortedAsc[currentEarningIndex].currentValueInPLN);
        currentEarningIndex += 1;
      }
    }

    return values;
  }

  CalculateEarningsByCategory(earnings: Earning[]) {
    let uniqueCategories = earnings.map(e => e.category).filter((value, index, self) => self.indexOf(value) === index);
    let data: object[] = [];

    uniqueCategories.forEach(c => {
      let categoryEntries = earnings.filter(e => e.category == c);
      let totalValue = categoryEntries
        .map(e => parseFloat(e.currentValueInPLN))
        .reduce((a,b) => a+b);

      data.push( {name: c, y: Number(totalValue.toFixed(2))} )
    });

    return data;
  }

  GenerateLineChart(title: string, categories: string[], data: number[]) {
    return new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: title,
        style: {
          fontSize: '1rem'
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            fontSize: '0.6rem'
          }
        }
      },
      series: [
        {
          showInLegend: false,
          name: "Wpływy",
          type: "spline",
          data: data
        }
      ]
    })
  }

  GeneratePieChart(title: string, categories: string[], data: object[]) {
    return new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: title
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
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
}
