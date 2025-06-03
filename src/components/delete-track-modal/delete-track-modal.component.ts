import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

import { TracksService } from "../../services";
import { DeleteTrackModalData, TrackModalResult } from '../../types/track-modal.type';
import { isTrackData, isTracksData } from '../../types/track-modal.predicate';


@Component({
  selector: 'delete-track-modal',
  templateUrl: 'delete-track-modal.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatProgressSpinner,
  ],
})

export class DeleteTrackModalComponent {
  private readonly tracksService = inject<TracksService>(TracksService);
  private readonly dialogRef = inject<MatDialogRef<DeleteTrackModalComponent>>(MatDialogRef<DeleteTrackModalComponent>);
  private readonly destroyRef = inject(DestroyRef);
  public readonly trackData = inject<DeleteTrackModalData>(MAT_DIALOG_DATA);

  submitted = signal<boolean>(false);

  submit(): void {
    this.submitted.set(true);

    if (isTrackData(this.trackData)) {
      this.tracksService.deleteTrack(this.trackData.track.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((_) => {
        this.submitted.set(false);
        this.dialogRef.close({submitted: true} as TrackModalResult);
      })
    } else if (isTracksData(this.trackData)) {
      this.tracksService.deleteTracks(this.trackData.tracks).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((_) => {
        this.submitted.set(false);
        this.dialogRef.close({submitted: true} as TrackModalResult);
      })
    }
  }

  close(): void {
    this.dialogRef.close({submitted: false} as TrackModalResult);
  }
}
