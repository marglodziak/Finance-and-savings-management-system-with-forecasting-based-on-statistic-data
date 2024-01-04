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
export class UserLayoutComponent implements OnInit, OnChanges {
  total: number = 0;
  routes: NavbarItem[] = [
    new NavbarItem("Dzień dobry!", "..\\..\\assets\\user-layout\\logo.png", "/"),
    new NavbarItem("Wpływy", "..\\..\\assets\\user-layout\\earnings.png", "earnings"),
    new NavbarItem("Oszczędności", "..\\..\\assets\\user-layout\\savings.png", "savings"),
    new NavbarItem("Wydatki", "..\\..\\assets\\user-layout\\expenses.png", "expenses"),
    new NavbarItem("Połącz użytkownika", "..\\..\\assets\\user-layout\\connect-user.png", "connectUser")
  ];
  currentTab: NavbarItem = this.routes[0];
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private earningsService: EarningsService,
    private expensesService: ExpensesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.routes.forEach(r => {
      if (this.router.url.endsWith(r.routerLink)) {
        this.currentTab = r;
        this.routes.forEach(r => r.isActive = false);
        this.currentTab.isActive = true;
      }
    });

    this.total = await this.calculateTotal();
    this.earningsService.testing.subscribe(t => this.total = t);
  }

  private async calculateTotal() {
    let earnings = await this.earningsService.sumEarnings();
    let expenses = await this.expensesService.sumExpenses();

    return parseFloat((earnings - expenses).toFixed(2));
  }

  ngOnChanges(): void {
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
