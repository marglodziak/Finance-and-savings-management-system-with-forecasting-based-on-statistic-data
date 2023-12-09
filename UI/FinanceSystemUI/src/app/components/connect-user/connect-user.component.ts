import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/HttpService/http.service';

@Component({
  selector: 'app-connect-user',
  templateUrl: './connect-user.component.html',
  styleUrls: ['./connect-user.component.css']
})
export class ConnectUserComponent {
  email: string = "bca";
  password: string = "";
  passwordRepeated: string = "";
  validPassword: boolean = true;
  errorMsgPassword: string = "";
  errorMsgPasswordRepeated: string = "";
  test: string = "";

  constructor(private httpService:HttpService) { }

  onSubmitExisting()
  {
    this.validPassword = this.ValidateForm();
    if (this.validPassword)
    {
      this.httpService.registerNewUser(this.email, this.password).subscribe();
    }
  }

  onSubmitNew()
  {
    this.validPassword = this.ValidateForm();
    if (this.validPassword)
    {
      this.httpService.registerNewUser(this.email, this.password).subscribe();
    }
  }

  private ValidateForm() : boolean
  {
    if (this.password != this.passwordRepeated)
    {
      this.errorMsgPasswordRepeated = "Wprowadzone hasła są różne.";
      return false;
    }

    return true;
  }
}
