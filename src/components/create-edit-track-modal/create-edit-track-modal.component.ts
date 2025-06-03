import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TracksService } from "../../services";
import { atLeastOneGenreValidator } from '../../shared/utils/validators';
import { TrackCreateRequest, TrackSearchItem } from '../../types/track-api.type';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DEFAULT_COVER_IMAGE } from '../../shared/utils/default-cover';
import { CreateEditModalData, TrackModalResult } from '../../types/track-modal.type';
import { isTrackDataDefined } from '../../types/track-modal.predicate';


@Component({
  selector: 'create-edit-track-modal',
  templateUrl: 'create-edit-track-modal.component.html',
  styleUrl: 'create-edit-track-modal.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinner,
  ],
})
export class CreateEditTrackModalComponent implements OnInit {
  private readonly tracksService = inject<TracksService>(TracksService);
  private readonly formBuilder = inject<FormBuilder>(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<CreateEditTrackModalComponent>>(MatDialogRef<CreateEditTrackModalComponent>);
  private readonly trackData = inject<CreateEditModalData>(MAT_DIALOG_DATA);
  private readonly destroyRef = inject<DestroyRef>(DestroyRef);

  trackForm!: FormGroup;
  genreClicked = signal<boolean>(false);
  genres = signal<string[]>([]);
  submitted = signal<boolean>(false);
  editMode = signal<boolean>(isTrackDataDefined(this.trackData));

  ngOnInit(): void {
    this.trackForm = this.formBuilder.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      album: [''],
      genres: [[], atLeastOneGenreValidator()],
      coverImage: ['']
    });

    if (isTrackDataDefined(this.trackData)) {
      this.trackForm.patchValue({
        title: this.trackData.title,
        artist: this.trackData.artist,
        album: this.trackData.album ?? '',
        genres: this.trackData.genres ?? [],
        coverImage: this.trackData.coverImage ?? '',
      });
    }

    this.tracksService.getGenres().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((genres: string[] | null) => {
      if (genres && Array.isArray(genres)) {
        this.genres.set(genres);
      }
    })
  }

  close(): void {
    this.dialogRef.close({ submitted: true } as TrackModalResult);
  }

  submit(): void {
    if (this.trackForm.invalid) {
      return;
    }

    this.submitted.set(true);

    const request: TrackCreateRequest = {
      ...this.trackForm.value,
      coverImage: this.trackForm.value.coverImage ? this.trackForm.value.coverImage : DEFAULT_COVER_IMAGE,
    };

    const trackUpdateObservable = isTrackDataDefined(this.trackData) ?
      this.tracksService.updateTrack(this.trackData.id, request) :
      this.tracksService.createTrack(request);

    trackUpdateObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((response: TrackSearchItem | null) => {
      this.submitted.set(false);

      this.dialogRef.close({ submitted: true, response: response } as TrackModalResult);
    })
  }

  toggleGenre(index: number): void {
    this.genreClicked.set(true);
    const genres = this.trackForm.get('genres')?.value;
    const genre = this.genres()[index];

    if (genres.includes(genre)) {
      genres.splice(genres.indexOf(genre), 1);
    } else {
      genres.push(genre);
    }

    this.trackForm.get('genres')?.setValue(genres);
  }

  isSelected(index: number): boolean {
    const genres = this.trackForm.get('genres')?.value;
    const genre = this.genres()[index];

    return genres.includes(genre);
  }
}
