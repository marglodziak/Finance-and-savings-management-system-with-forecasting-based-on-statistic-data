import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ChartModule } from 'angular-highcharts';

import { UserLayoutRoutes } from './user-layout.routing';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { ConnectUserComponent } from '../../components/connect-user/connect-user.component';
import { EarningsComponent } from 'src/app/components/earnings/earnings.component';
import { SavingsComponent } from 'src/app/components/savings/savings.component';
import { ExpensesComponent } from 'src/app/components/expenses/expenses.component';
import { HistoryComponent } from 'src/app/components/history/history.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ConnectUserComponent,
    EarningsComponent,
    SavingsComponent,
    ExpensesComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(UserLayoutRoutes),
    ChartModule
  ]
})
export class UserLayoutModule { }
