import {inject, Injectable} from '@angular/core';
import {Collection, TrackCreateRequest, TrackParams, TrackSearchItem} from '../types/track-search-item.type';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private readonly http = inject<HttpClient>(HttpClient);

  private readonly baseUrl = 'http://localhost:8000/api';

  getTracks(params: TrackParams = {}): Observable<Collection> {
    return this.http.get<Collection>(
      `${this.baseUrl}/tracks`,
      { params: this.transformToHttpParams(params) }
    );
  }

  createTrack(trackRequest: TrackCreateRequest): Observable<TrackSearchItem> {
    return this.http.post<TrackSearchItem>(
      `${this.baseUrl}/tracks`, trackRequest
    );
  }

  updateTrack(id: string, trackRequest: TrackCreateRequest): Observable<TrackSearchItem> {
    return this.http.put<TrackSearchItem>(
      `${this.baseUrl}/tracks/${id}`, trackRequest
    );
  }

  deleteTrack(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/tracks/${id}`,
    );
  }

  uploadTrackFile(id: string, file: File): Observable<TrackSearchItem> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<TrackSearchItem>(`${this.baseUrl}/tracks/${id}/upload`, formData);
  }

  deleteTrackFile(id: string): Observable<TrackSearchItem> {
    return this.http.delete<TrackSearchItem>(`${this.baseUrl}/tracks/${id}/file`);
  }

  deleteTracks(ids: string[]): Observable<{ success: string[]; failed: string[] }> {
    return this.http.post<{ success: string[]; failed: string[] }>(`${this.baseUrl}/tracks/delete`, {ids: ids});
  }

  getGenres(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/genres`,
    );
  }

  private transformToHttpParams(params: TrackParams): HttpParams {
    const transformedParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = String(value);
      }
      else {
        delete acc[key];
      }
      return acc;
    }, {} as { [param: string]: string });

    return new HttpParams({ fromObject: transformedParams });
  }
}
