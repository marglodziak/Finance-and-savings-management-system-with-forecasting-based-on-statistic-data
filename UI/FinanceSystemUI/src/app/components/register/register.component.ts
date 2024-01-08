import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

    constructor(private httpService:HttpService, private router:Router) { }

    onSubmit()
    {
      this.validPassword = this.ValidateForm();
      if (this.validPassword)
      {
        this.httpService.registerNewUser(this.email, this.password).subscribe({
          next: value => {
            alert("Stworzenie Twojego konta przebiegło poprawnie. Możesz się zalogować.");
            this.router.navigate(['login']);
          },
          error: err => alert(`Błąd podczas rejestracji: ${err.error}. Spróbuj ponownie.`)
        });
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
