import {CreateEditModalData, DeleteTrackModalData} from "./track-modal.type";
import {TrackSearchItem} from "./track-search-item.type";

export function isTrackData(data: DeleteTrackModalData): data is { track: TrackSearchItem } {
  return !!data.track && !data.tracks;
}

export function isTracksData(data: DeleteTrackModalData): data is { tracks: string[] } {
  return !!data.tracks && !data.track;
}

export function isTrackDataDefined(data: CreateEditModalData): data is TrackSearchItem {
  return !!data;
}

