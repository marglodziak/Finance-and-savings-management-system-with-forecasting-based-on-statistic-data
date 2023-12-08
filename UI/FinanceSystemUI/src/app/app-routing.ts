import { NgModule, inject } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authenticationGuard } from './authGuards/loginGuard';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    canActivate: [(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
      {
        const authService = inject(AuthService);
        const router = inject(Router);
        
        if (authService.isUserLoggedIn())
        {
          window.location.reload();
        }

        return !authService.isUserLoggedIn();
      }
    ], 
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
    canActivate: [(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
      {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isUserLoggedIn())
        {
          router.navigate(['authentication']);
        }
        
        return authService.isUserLoggedIn();
      }      
    ],
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