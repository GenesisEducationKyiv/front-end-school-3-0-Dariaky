import {CreateEditModalData, DeleteTrackModalData} from "./track-modal.type";
import { TrackSearchItem } from './track-api.type';

export function isTrackData<T>(data: DeleteTrackModalData<T>): data is { track: T; tracks?: undefined } {
  return (
    !!data.track &&
    typeof data.track === 'object' &&
    'id' in data.track &&
    'title' in data.track &&
    !(!!data.tracks)
  );
}

export function isTracksData<T>(data: DeleteTrackModalData<T>): data is { tracks: string[]; track?: undefined } {
  return (
    !!data.tracks &&
    Array.isArray(data.tracks) &&
    data.tracks.every(t => typeof t === 'string') &&
    !(!!data.track)
  );
}

export function isTrackDataDefined(data: CreateEditModalData): data is TrackSearchItem {
  return !!data &&
    typeof data === 'object' &&
    'id' in data &&
    'title' in data;
}

