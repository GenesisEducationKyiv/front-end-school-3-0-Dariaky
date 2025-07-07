import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TracksService } from '../../services';
import { loadTracks, loadTracksSuccess, loadTracksFailure } from './tracks.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TracksEffects {
  private actions$ = inject(Actions); // With standalone components, it's important to inject actions not via constructor but using inject()
  private tracksService = inject(TracksService);

  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTracks),
      mergeMap(({ params }) =>
        this.tracksService.getTracks(params).pipe(
          map((tracks) => loadTracksSuccess({ tracks })),
          catchError((error) => of(loadTracksFailure({ error })))
        )
      )
    )
  );
}
