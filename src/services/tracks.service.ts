import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  TrackCollectionResponse,
  TrackCollectionResponseSchema,
  TrackCreateRequest,
  TrackParams,
  TracksDeleteResponse,
  TracksDeleteResponseSchema,
  TrackSearchItem,
  TrackSearchItemSchema
} from '../types/track-api.type';
import { zodSchemaValidator } from '../shared/utils/validators';


@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private readonly http = inject<HttpClient>(HttpClient);

  private readonly baseUrl = 'http://localhost:8000/api';

  getTracks(params: TrackParams = {}): Observable<TrackCollectionResponse | null> {
    return this.http.get<TrackCollectionResponse>(
      `${this.baseUrl}/tracks`,
      { params: this.transformToHttpParams(params) }
    ).pipe(
      zodSchemaValidator(TrackCollectionResponseSchema),
      catchError((_) => of(null))
    );
  }

  createTrack(trackRequest: TrackCreateRequest): Observable<TrackSearchItem | null> {
    return this.http.post<TrackSearchItem>(`${this.baseUrl}/tracks`, trackRequest).pipe(
      zodSchemaValidator(TrackSearchItemSchema),
      catchError((_) => of(null))
    );
  }

  updateTrack(id: string, trackRequest: TrackCreateRequest): Observable<TrackSearchItem | null> {
    return this.http.put<TrackSearchItem>(
      `${this.baseUrl}/tracks/${id}`, trackRequest
    ).pipe(
      zodSchemaValidator(TrackSearchItemSchema),
      catchError((_) => of(null))
    );
  }

  deleteTrack(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/tracks/${id}`,
    ).pipe(
      catchError((_) => of())
    );
  }

  uploadTrackFile(id: string, file: File): Observable<TrackSearchItem | null> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<TrackSearchItem>(`${this.baseUrl}/tracks/${id}/upload`, formData).pipe(
      zodSchemaValidator(TrackSearchItemSchema),
      catchError((_) => of(null))
    );
  }

  deleteTrackFile(id: string): Observable<TrackSearchItem | null> {
    return this.http.delete<TrackSearchItem>(`${this.baseUrl}/tracks/${id}/file`).pipe(
      zodSchemaValidator(TrackSearchItemSchema),
      catchError((_) => of(null))
    );
  }

  deleteTracks(ids: string[]): Observable<TracksDeleteResponse | null> {
    return this.http.post<{ success: string[]; failed: string[] }>(`${this.baseUrl}/tracks/delete`, {ids: ids})
      .pipe(
        zodSchemaValidator(TracksDeleteResponseSchema),
        catchError((_) => of(null))
      );
  }

  getGenres(): Observable<string[] | null> {
    return this.http.get<string[]>(
      `${this.baseUrl}/genres`,
    ).pipe(
      catchError((_) => of(null))
    )
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
