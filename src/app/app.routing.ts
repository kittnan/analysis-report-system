import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './pages/login/login.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    // redirectTo: 'dashboard',
    pathMatch: 'full',
  }, 
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }]
  },
  {
    path:'login', component:LoginComponent
  },


  {
    path: '**',
    redirectTo: 'login'
    // redirectTo: 'dashboard'
  }
]
