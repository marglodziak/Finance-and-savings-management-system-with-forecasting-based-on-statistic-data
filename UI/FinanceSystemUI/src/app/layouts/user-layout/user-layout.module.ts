import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserLayoutRoutes } from './user-layout.routing';
import { MainSiteComponent } from '../../components/main-site/main-site.component';
import { ConnectUserComponent } from '../../components/connect-user/connect-user.component';
import { EarningsComponent } from 'src/app/components/earnings/earnings.component';
import { SavingsComponent } from 'src/app/components/savings/savings.component';
import { ExpensesComponent } from 'src/app/components/expenses/expenses.component';
import { HistoryComponent } from 'src/app/components/history/history.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    MainSiteComponent,
    ConnectUserComponent,
    EarningsComponent,
    SavingsComponent,
    ExpensesComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forChild(UserLayoutRoutes)
  ]
})
export class UserLayoutModule { }
