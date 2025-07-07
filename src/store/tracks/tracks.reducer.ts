import { createReducer, on } from '@ngrx/store';
import { loadTracks, loadTracksSuccess, loadTracksFailure } from './tracks.actions';
import { TracksState } from './tracks.state';

export const initialState: TracksState = {
  tracks: null,
  error: null,
};

export const tracksReducer = createReducer(
  initialState,
  on(loadTracks, (state) => ({ ...state })),
  on(loadTracksSuccess, (state, { tracks }) => ({ ...state, tracks })),
  on(loadTracksFailure, (state, { error }) => ({ ...state, error }))
);
