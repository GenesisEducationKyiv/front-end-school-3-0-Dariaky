import {TrackSearchItem} from "./track-search-item.type";

export interface TrackModalResult {
  submitted: boolean;
  response?: TrackSearchItem;
}

export type DeleteTrackModalData =
  | { track: TrackSearchItem; tracks?: undefined }
  | { tracks: string[]; track?: undefined };

export type CreateEditModalData =
  | TrackSearchItem
  | undefined;
