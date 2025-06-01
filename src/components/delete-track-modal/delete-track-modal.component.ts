import {Component, DestroyRef, inject, signal} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TracksService} from "../../services";
import {TrackSearchItem} from "../../types/track-search-item.type";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
  private readonly tracksService = inject(TracksService);
  private readonly dialogRef = inject(MatDialogRef<DeleteTrackModalComponent>);
  private readonly destroyRef = inject(DestroyRef);
  public readonly trackData = inject<{ track: TrackSearchItem, tracks: string[] }>(MAT_DIALOG_DATA);

  submitted = signal<boolean>(false);

  submit(): void {
    this.submitted.set(true);

    if (this.trackData.track) {
      this.tracksService.deleteTrack(this.trackData.track.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((_) => {
        this.submitted.set(false);
        this.dialogRef.close({submitted: true, response: null});
      })
    } else {
      this.tracksService.deleteTracks(this.trackData.tracks).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((_) => {
        this.submitted.set(false);
        this.dialogRef.close({submitted: true, response: null});
      })
    }
  }

  close() {
    this.dialogRef.close({submitted: false, response: null});
  }
}
