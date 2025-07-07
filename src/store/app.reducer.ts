import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';

import { tracksReducer } from './tracks/tracks.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  tracks: tracksReducer,
};
