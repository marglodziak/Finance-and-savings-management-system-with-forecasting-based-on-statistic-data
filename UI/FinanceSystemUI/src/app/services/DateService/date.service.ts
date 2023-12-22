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

  GetDatesInRange(startDate: Date, endDate: Date) {
    var dates: Date[] = [];

    while (startDate <= endDate) {
      dates.push(startDate);
      startDate = this.AddDays(startDate, 1);
    }

    return dates;
  }

  AddDays(date: Date, n: number) {
    date.setDate(date.getDate() + n);

    return date
  }
}
