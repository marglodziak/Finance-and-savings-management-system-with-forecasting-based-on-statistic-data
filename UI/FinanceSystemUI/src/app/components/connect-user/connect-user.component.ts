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
  usersIAmConnectedTo: ConnectedUser[] = [];
  usersConnectedToMe: ConnectedUser[] = [];
  deleteConnectedToMeEnabled: boolean = false;
  deleteIAmConnectedToEnabled: boolean = false;

  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    this.httpService.getUsersIAmConnectedTo().subscribe(response => this.usersIAmConnectedTo = response);
    this.httpService.getUsersConnectedToMe().subscribe(response => this.usersConnectedToMe = this.usersConnectedToMe.concat(response));
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

  deleteUserIAmConnectedTo(i: number) {
    if (!confirm("Czy na pewno chcesz usunąć to połączenie?"))
    {
      return;
    }

    let username = this.usersIAmConnectedTo[i].connectedUsername;
    this.httpService.deleteUserIAmConnectedTo(username).subscribe();
    this.usersIAmConnectedTo.splice(i, 1);
  }

  deleteUserConnectedToMe(i: number) {
    if (!confirm("Czy na pewno chcesz usunąć to połączenie?"))
    {
      return;
    }

    let userEmail = this.usersConnectedToMe[i].connectingEmail;
    this.httpService.deleteUserConnectedToMe(userEmail).subscribe();
    this.usersConnectedToMe.splice(i, 1);
  }

  editIAmConnectedTo() {
    this.deleteIAmConnectedToEnabled = !this.deleteIAmConnectedToEnabled;
  }

  editConnectedToMe() {
    this.deleteConnectedToMeEnabled = !this.deleteConnectedToMeEnabled;
  }
}
