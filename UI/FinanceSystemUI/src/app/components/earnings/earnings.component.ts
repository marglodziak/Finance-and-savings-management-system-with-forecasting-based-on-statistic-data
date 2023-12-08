import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Earning } from '../models/earning';
import { DatePipe } from '@angular/common';
import { ListHeader } from '../models/listHeader';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent implements OnInit{
  categories: string[] = [];
  earningsInput: Earning[] = [];
  earnings: Earning[] = [];
  listHeaders: ListHeader[] = [
    new ListHeader("Data", -1),
    new ListHeader("Kategoria", 0),
    new ListHeader("Wartość", 0)
  ]
  
  addRowDisabled: boolean = true;
  modalDisabled: boolean = true;

  constructor(private httpService:HttpService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    if (this.earnings.length != 0)
    {
      return;
    }

    this.httpService.getEarnings().subscribe(response => this.earnings = response.sort((a,b) => Number(new Date(b.date)) - Number(new Date(a.date))));
    this.httpService.getEarningCategories().subscribe(response => {
      this.categories = response;
      this.earningsInput.push(this.CreateInputRow());
    });
  }

  trackByFn(index: any) {
    return index;  
  }

  openModal() {
    this.modalDisabled = false;
  }

  closeModal() {
    this.modalDisabled = true;
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
        this.earnings = this.earnings.sort((a,b) => Number(new Date(b.date)) - Number(new Date(a.date)));
        break;
      case this.listHeaders[1].name:
        this.earnings = this.earnings.sort((a,b) => a.category.localeCompare(b.category));
        break;
      default:
        this.earnings = this.earnings.sort((a,b) => b.value - a.value);
        break;
    }

    if (header.arrowDirection == 1) {
      this.earnings = this.earnings.reverse();
    }
  }

  filterEarnings() {
    this.earnings.sort((a,b) => b.value-a.value);
  }
  
  onChange(value: any)
  {
    let currentEarning = this.earningsInput.at(-1);
    if (currentEarning?.value != 0 && currentEarning?.category != "")
    {
      this.addRowDisabled = false;
    }    
  }

  addRow()
  {
    this.earningsInput.push(this.CreateInputRow());
    this.addRowDisabled = true;
  }

  submitInput()
  {
    let test = this.httpService.addEarning(JSON.stringify(this.earningsInput)).subscribe();
    this.earnings = this.earnings.concat(this.earningsInput);
    this.ResetInput();
    this.sortItems(this.listHeaders.find(h => h.arrowDirection != 0)!);
  }

  private ResetInput()
  {
    this.earningsInput = [this.CreateInputRow()];
  }

  private CreateInputRow()
  {
    return new Earning(this.datePipe.transform(new Date(), "yyyy-MM-dd")!, this.categories[0], "0.00")
  }
}
