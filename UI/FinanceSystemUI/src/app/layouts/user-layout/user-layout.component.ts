import { Component, OnChanges, OnInit } from '@angular/core';
import { NavbarItem } from 'src/app/components/models/navbarItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnChanges {
  
  constructor(private router: Router) { }

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
    window.sessionStorage.clear();
    window.location.reload();
  }
}
