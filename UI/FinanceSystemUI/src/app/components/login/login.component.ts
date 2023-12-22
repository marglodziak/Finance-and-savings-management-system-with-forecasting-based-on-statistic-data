import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { HttpService } from 'src/app/services/HttpService/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../app.component.css',
              '../../layouts/auth-layout/auth-layout.component.css',
              './login.component.css']
})
export class LoginComponent{
    email: string = "test@test.pl";
    password: string = "Test123";
    passwordRepeated: string = "";
    validPassword: boolean = true;
    errorMsgPassword: string = "";
    errorMsgPasswordRepeated: string = "";
    test: string = "";
    token: string = "";

    constructor(private httpService:HttpService, private authService: AuthService, private router:Router) { }

    onSubmit()
    {
      this.validPassword = this.ValidateForm();
      if (this.validPassword)
      {
        this.httpService.logIn(this.email, this.password).subscribe(response => {
          this.authService.SaveAccessToken(response.accessToken);
          this.authService.SaveRefreshToken(response.refreshToken);
          window.location.reload();    
        });
      }

    }

    private ValidateForm() : boolean
    {
      

      return true;
    }

}
