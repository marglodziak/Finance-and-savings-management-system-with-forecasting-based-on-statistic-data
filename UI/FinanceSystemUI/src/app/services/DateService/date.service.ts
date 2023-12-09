import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor(private datePipe: DatePipe) { }

  GetMonthEarlierDate() {
    var currentDate = new Date();
    var startMonth = currentDate.getMonth() - 1;
    currentDate.setMonth(startMonth);

    return currentDate;
  }

  FormatDateToLocale(date: Date) {
    return this.datePipe.transform(date, "yyyy-MM-dd")!;
  }

  GetDatesInRange(startDateText: string, endDateText: string) {
    var dates: string[] = [];
    let startDate = new Date(startDateText);
    let endDate = new Date(endDateText);

    while (startDate <= endDate) {
      dates.push(this.FormatDateToLocale(startDate));
      startDate = this.AddDays(startDate, 1);
    }

    return dates;
  }

  AddDays(date: Date, n: number) {
    date.setDate(date.getDate() + n);

    return date
  }
}
