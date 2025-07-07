import { TrackCollectionResponse } from '../../types/track-api.type';

export interface TracksState {
  tracks: TrackCollectionResponse | null;
  error: any;
}
