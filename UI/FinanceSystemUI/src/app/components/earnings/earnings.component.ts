import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Earning } from '../models/earning';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent implements OnInit{
  categories: string[] = [];
  earningsInput: Earning[] = [this.CreateInputRow()];
  earnings: Earning[] = [];
  
  chosenCategory = this.categories[0];
  addRowDisabled: boolean = true;

  constructor(private httpService:HttpService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.httpService.getEarnings().subscribe(response => this.earnings = response);
    this.httpService.getEarningCategories().subscribe(response => this.categories = response);
  }

  trackByFn(index: any) {
    return index;  
  }
  
  onChange(value: any)
  {
    //alert(value);
    let currentEarning = this.earningsInput.at(-1);
    //currentEarning!.date = new Date(value);
    //alert(currentEarning?.date);
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
    this.sortEarnings();
  }

  private ResetInput()
  {
    this.earningsInput = [this.CreateInputRow()];
  }

  private sortEarnings()
  {
    //  this.earnings = this.earnings.sort((a, b) => a.date - b.date)
  }

  private CreateInputRow()
  {
    return new Earning(this.datePipe.transform(new Date(), "yyyy-MM-dd")!, this.categories[2], "0.00")
  }
}
