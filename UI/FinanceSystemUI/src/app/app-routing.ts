import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: UserLayoutComponent,
    //canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/user-layout/user-layout.module').then(m => m.UserLayoutModule)
      }
    ]
  },
  {
    path: 'authentication',
    component: UserLayoutComponent,
    //canActivate: [AuthGuard],
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