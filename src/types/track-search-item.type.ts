export interface Collection {
  data: TrackSearchItem[];
  meta: CollectionMeta;
}

export interface CollectionMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrackSearchItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  slug: string;
  coverImage: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackCreateRequest {
  title: string;
  artist: string;
  album: string;
  genres: string[];
  "coverImage": string;
}

export interface TrackParams {
  page?: number;
  limit?: number;
  sort?: TrackSort;
  order?: TrackOrder;
  search?: string;
  genre?: string;
  artist?: string;
}

export type TrackSort = 'title' | 'artist' | 'album' | 'createdAt';
export type TrackOrder = 'asc' | 'desc';
