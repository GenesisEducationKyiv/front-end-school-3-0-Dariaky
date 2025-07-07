import { createAction, props } from '@ngrx/store';
import { TrackCollectionResponse, TrackParams } from '../../types/track-api.type';

export const loadTracks = createAction(
  '[Tracks] Load Tracks',
  props<{ params?: TrackParams }>()
);

export const loadTracksSuccess = createAction(
  '[Tracks] Load Tracks Success',
  props<{ tracks: TrackCollectionResponse | null }>()
);

export const loadTracksFailure = createAction(
  '[Tracks] Load Tracks Failure',
  props<{ error: any }>()
);
