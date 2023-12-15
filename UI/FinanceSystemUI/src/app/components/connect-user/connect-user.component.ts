import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/HttpService/http.service';
import { ConnectedUser } from '../models/connectedUser';

@Component({
  selector: 'app-connect-user',
  templateUrl: './connect-user.component.html',
  styleUrls: ['./connect-user.component.css']
})
export class ConnectUserComponent implements OnInit{
  isCodeGenerated: boolean = false;
  connectionCode: string = "";
  connectionCodeInput: string = "";
  connectedUsers: ConnectedUser[] = [];

  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    this.httpService.getConnectedUsers().subscribe(response => this.connectedUsers = response);
  }  

  generateCode() {
    this.httpService.connectUser().subscribe(response => {
      this.connectionCode = response;
      this.isCodeGenerated = !this.isCodeGenerated;
    })    
  }

  checkCode() {
    this.httpService.checkConnectionCode(this.connectionCodeInput).subscribe({
      next: userId => {
        var name = prompt("Podaj własną nazwę dla użytkownika");
        this.httpService.setConnectedUsername(Number(userId), name!).subscribe();
      },
      error: err => alert(err.error),
      complete: () => alert("Skonczone")
    })
  }

  changeUsername(user: ConnectedUser) {
    user.isEditable = !user.isEditable;
  }
}
