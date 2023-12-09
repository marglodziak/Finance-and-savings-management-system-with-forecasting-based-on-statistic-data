import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/HttpService/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../app.component.css',
              '../../layouts/auth-layout/auth-layout.component.css',
              './register.component.css']
})
export class RegisterComponent {
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
