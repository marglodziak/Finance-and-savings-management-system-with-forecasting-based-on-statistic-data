import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { EarningsInput } from '../models/earningsInput';
import { EarningsHistory } from '../models/earningsHistory';
import { AddEarning } from '../requests/addEarning';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent {
  categories: string[] = [
    "Pensja",
    "Oszczędności",
    "Odsetki",
    "Prezent",
    "Darowizna"
  ];
  earningsInput: EarningsInput[] = [new EarningsInput(new Date(), this.categories[2])];
  earnings: EarningsHistory[] = [
    new EarningsHistory(new Date(), "testCat", "1234.15"),
    // new EarningsHistory(new Date("2023-05-20"), "testCat2", "1234.15"),
    // new EarningsHistory(new Date("2023-06-1"), "testCat3", "1234.15"),
    // new EarningsHistory(new Date(), "testCat4", "1234.15"),
  ];
  
  chosenCategory = this.categories[0];
  addRowDisabled: boolean = true;

  constructor(private httpService:HttpService) { }

  trackByFn(index: any) {
    return index;  
  }
  
  onChange(value: any)
  {
    //alert(value);
    let currentEarning = this.earningsInput.at(-1);
    //currentEarning!.date = new Date(value);
    //alert(currentEarning?.date);
    if (currentEarning?.value != "" && currentEarning?.category != "")
    {
      this.addRowDisabled = false;
    }    
  }

  addRow()
  {
    this.earningsInput.push(new EarningsInput(new Date(), this.categories[2]));
    this.addRowDisabled = true;
  }

  submitInput()
  {
    let request = new AddEarning(1);

    this.earningsInput.forEach(earning => {
        alert(earning.date);
        // request.earnings.push(new EarningsHistory(earning.date, earning.category, earning.value))
    });
    //alert(JSON.stringify(confirmedEarnings));
    //let test = this.httpService.addEarning(JSON.stringify(request)).subscribe();
    this.earningsInput = [new EarningsInput()];
  }
}
