import { Component } from '@angular/core';
import { UserLayoutRoutes } from './user-layout.routing';
import { NavbarItem } from 'src/app/components/models/navbarItem';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent {
  routes: NavbarItem[] = [
    new NavbarItem("Wpływy", "..\\..\\assets\\user-layout\\earnings.png", "earnings"),
    new NavbarItem("Oszczędności", "..\\..\\assets\\user-layout\\savings.png", "savings"),
    new NavbarItem("Wydatki", "..\\..\\assets\\user-layout\\expenses.png", "expenses"),
    new NavbarItem("Połącz użytkownika", "..\\..\\assets\\user-layout\\connect-user.png", "connectUser")
  ];

  LogOut()
  {
    window.sessionStorage.clear();
    window.location.reload();
  }
}
