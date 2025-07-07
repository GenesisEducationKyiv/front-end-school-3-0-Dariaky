import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appReducers } from '../store/app.reducer';
import { AppEffects } from '../store/app.effects';
import { TracksEffects } from '../store/tracks/tracks.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideStore(appReducers),
    provideEffects([AppEffects, TracksEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
