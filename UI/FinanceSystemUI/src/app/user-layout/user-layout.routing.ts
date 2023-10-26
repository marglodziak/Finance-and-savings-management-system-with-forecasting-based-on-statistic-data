import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { ConnectUserComponent } from '../components/connect-user/connect-user.component';

export const UserLayoutRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'connectUser', component: ConnectUserComponent },
  { path: '**', redirectTo: "login" }
];