import { Component, OnChanges, OnInit } from '@angular/core';
import { NavbarItem } from 'src/app/components/models/navbarItem';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { EarningsService } from 'src/app/services/EarningsService/earnings.service';
import { ExpensesService } from 'src/app/services/ExpensesService/expenses.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent {
  total: string = "";
  totalEarnings: number = 0;
  totalExpenses: number = 0;
  routes: NavbarItem[] = [
    new NavbarItem("Dzień dobry!", "..\\..\\assets\\user-layout\\logo.png", "/"),
    new NavbarItem("Wpływy", "..\\..\\assets\\user-layout\\earnings.png", "earnings"),
    new NavbarItem("Wydatki", "..\\..\\assets\\user-layout\\expenses.png", "expenses"),
    new NavbarItem("Prognozy", "..\\..\\assets\\user-layout\\forecasts.png", "forecasts"),
    new NavbarItem("Połącz użytkownika", "..\\..\\assets\\user-layout\\connect-user.png", "connectUser")
  ];
  currentTab: NavbarItem = this.routes[0];
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private earningsService: EarningsService,
    private expensesService: ExpensesService
  ) {
    this.routes.forEach(r => {
      if (this.router.url.endsWith(r.routerLink)) {
        this.currentTab = r;
        this.routes.forEach(r => r.isActive = false);
        this.currentTab.isActive = true;
      }

      this.earningsService.getEarnings();
      this.expensesService.getExpenses();
    });

    this.earningsService.earningsChannel.subscribe(e => {
      this.totalEarnings = e.map(el => el.currentValueInPLN).reduce((a,b) => {return a+b}, 0);
    });
    this.expensesService.expensesChannel.subscribe(e => {
      this.totalExpenses = e.map(el => el.currentValueInPLN).reduce((a,b) => {return a+b}, 0);
    });
  }

  tabChanged(tab: NavbarItem) {
    this.currentTab = tab;
    this.routes.forEach(r => r.isActive = false);
    this.currentTab.isActive = true;
  }

  LogOut()
  {
    this.authService.LogOut();
    window.location.reload();
  }
}
