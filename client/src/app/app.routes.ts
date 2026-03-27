import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.Register) },
  { path: '**', redirectTo: '' },
];
