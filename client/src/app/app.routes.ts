import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.Register) },
  {
    path: 'dashboard',
    pathMatch: 'full',
    redirectTo: 'dashboard/overview',
  },
  {
    path: 'dashboard/:section',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
