import { Routes } from '@angular/router';
import { DashboardComponent as DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { ConnectUserComponent } from '../../components/connect-user/connect-user.component';
import { EarningsComponent } from 'src/app/components/earnings/earnings.component';
import { SavingsComponent } from 'src/app/components/savings/savings.component';
import { ExpensesComponent } from 'src/app/components/expenses/expenses.component';
import { HistoryComponent } from 'src/app/components/history/history.component';

export const UserLayoutRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'earnings', component: EarningsComponent },
  { path: 'savings', component: SavingsComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'connectUser', component: ConnectUserComponent },
  { path: '**', redirectTo: '' }
];