import { NgModule, inject } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authenticatedGuard, notAuthenticatedGuard } from './authGuards/loginGuard';

const routes: Routes = [
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    canActivate: [notAuthenticatedGuard()], 
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    path: 'dashboard',
    component: UserLayoutComponent,
    canActivate: [authenticatedGuard()],
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/user-layout/user-layout.module').then(m => m.UserLayoutModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "dashboard"
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
  providers: [
  ]
})
export class AppRoutingModule { }