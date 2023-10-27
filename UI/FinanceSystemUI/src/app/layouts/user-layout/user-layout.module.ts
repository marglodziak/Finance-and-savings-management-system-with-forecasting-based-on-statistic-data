import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../components/login/login.component';
import { RouterModule } from '@angular/router';

import { UserLayoutRoutes } from './user-layout.routing';
import { MainSiteComponent } from '../../components/main-site/main-site.component';
import { ConnectUserComponent } from '../../components/connect-user/connect-user.component';
import { RegisterComponent } from '../../components/register/register.component';



@NgModule({
  declarations: [
    RegisterComponent,
    MainSiteComponent,
    ConnectUserComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(UserLayoutRoutes)
  ]
})
export class UserLayoutModule { }
