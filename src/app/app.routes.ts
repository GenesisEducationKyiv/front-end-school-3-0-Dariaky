import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/tracks-page/tracks-page.component').then(m => m.TracksPageComponent),
    pathMatch: 'full',
  },
  {
    path: '404',
    loadComponent: () => import('../shared').then(m => m.PageNotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
