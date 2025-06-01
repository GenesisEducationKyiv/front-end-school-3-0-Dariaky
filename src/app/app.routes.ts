import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '../shared';
import {TracksPageComponent} from "../components/tracks-page/tracks-page.component";

export const routes: Routes = [
  {
    path: '',
    component: TracksPageComponent,
    pathMatch: 'full',
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
