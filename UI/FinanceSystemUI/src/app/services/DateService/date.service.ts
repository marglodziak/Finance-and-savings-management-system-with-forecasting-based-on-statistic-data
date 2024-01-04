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

  FormatDateToShort(date: Date) {
    return this.datePipe.transform(date, "MM.yyyy")!;
  }

  GetDatesInRange(startDate: string, endDate: string) {
    var dates: Date[] = [];
    let start = new Date(startDate);
    let end = new Date(endDate);

    while (start <= end) {
      dates.push(new Date(start));
      start = this.AddDays(start, 1);
    }

    return dates;
  }

  GetMonthsInRange(startDate: string, endDate: string) {
    var dates: string[] = [];
    let start = this.AddMonths(new Date(startDate), -6);
    let end = new Date(endDate);
    start.setDate(1);
    end.setDate(1);

    while (start <= end) {
      dates.push(this.FormatDateToShort(start));
      start = this.AddMonths(start, 1);
    }

    return dates;
  }

  AddDays(date: Date, n: number) {
    date.setDate(date.getDate() + n);

    return date
  }

  AddMonths(date: Date, n: number) {
    date.setMonth(date.getMonth() + n);

    return date
  }
}
