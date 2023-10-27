import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../app.component.css',
              '../../layouts/user-layout/user-layout.component.css',
              './login.component.css']
})
export class LoginComponent {
    email: string = "bca";
    password: string = "";
    passwordRepeated: string = "";
    validPassword: boolean = true;
    errorMsgPassword: string = "";
    errorMsgPasswordRepeated: string = "";
    test: string = "";

    constructor(private httpService:HttpService) { }

    onSubmit()
    {
      this.validPassword = this.ValidateForm();
      if (this.validPassword)
      {
        this.httpService.logIn(this.email, this.password).subscribe();
      }
    }

    private ValidateForm() : boolean
    {
      

      return true;
    }

}
