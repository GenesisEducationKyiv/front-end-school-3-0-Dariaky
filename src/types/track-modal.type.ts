import { TrackSearchItem } from './track-api.type';

export interface TrackModalResult {
  submitted: boolean;
  response?: TrackSearchItem;
}

export type DeleteTrackModalData<T = TrackSearchItem> =
    | { track: T; tracks?: undefined }
    | { tracks: string[]; track?: undefined };

export type CreateEditModalData =
  | TrackSearchItem
  | undefined;
