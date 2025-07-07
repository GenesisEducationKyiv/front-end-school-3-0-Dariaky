import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { TracksState } from './tracks.state';
import { TrackCollectionMeta, TrackSearchItem } from '../../types/track-api.type';

export const selectTracksState = (state: AppState) => state.tracks;

export const selectTracksData = createSelector(
  selectTracksState,
  (state: TracksState): TrackSearchItem[] | undefined => state.tracks?.data
);

export const selectTracksMeta = createSelector(
  selectTracksState,
  (state: TracksState): TrackCollectionMeta | undefined => state.tracks?.meta
);
