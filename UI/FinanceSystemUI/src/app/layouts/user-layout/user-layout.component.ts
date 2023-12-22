import { Component, OnChanges } from '@angular/core';
import { NavbarItem } from 'src/app/components/models/navbarItem';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService/auth.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnChanges {
  
  constructor(private router: Router, private authService: AuthService) { }

  routes: NavbarItem[] = [
    new NavbarItem("Wpływy", "..\\..\\assets\\user-layout\\earnings.png", "earnings"),
    new NavbarItem("Oszczędności", "..\\..\\assets\\user-layout\\savings.png", "savings"),
    new NavbarItem("Wydatki", "..\\..\\assets\\user-layout\\expenses.png", "expenses"),
    new NavbarItem("Połącz użytkownika", "..\\..\\assets\\user-layout\\connect-user.png", "connectUser")
  ];

  ngOnChanges(): void {
    alert(this.router.getCurrentNavigation())
  }

  LogOut()
  {
    this.authService.LogOut();
    window.location.reload();
  }
}
