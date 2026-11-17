import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'discover', pathMatch: 'full' },
  {
    path: 'discover',
    loadComponent: () => import('./features/discover/discover.component').then(m => m.DiscoverComponent)
  },
  {
    path: 'quotes',
    loadComponent: () => import('./features/quotes/quotes.component').then(m => m.QuotesComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  }
];
