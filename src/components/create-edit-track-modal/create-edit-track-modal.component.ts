import {Component, DestroyRef, inject, OnInit, signal} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TracksService} from "../../services";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {imageUrlValidator, atLeastOneGenreValidator} from "../../shared/utils/validators";
import {TrackCreateRequest, TrackSearchItem} from "../../types/track-search-item.type";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DEFAULT_COVER_IMAGE} from "../../shared/utils/default-cover";


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
  private readonly tracksService = inject(TracksService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateEditTrackModalComponent>);
  private readonly trackData = inject<TrackSearchItem>(MAT_DIALOG_DATA);
  private readonly destroyRef = inject(DestroyRef);

  trackForm!: FormGroup;
  genreClicked = signal<boolean>(false);
  genres = signal<string[]>([]);
  submitted = signal<boolean>(false);
  creationMode = signal<boolean>(true);

  ngOnInit() {
    if (this.trackData) {
      this.creationMode.set(false);
    }

    this.trackForm = this.formBuilder.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      album: [''],
      genres: [[], atLeastOneGenreValidator()],
      coverImage: ['', imageUrlValidator()]
    });

    if (!this.creationMode()) {
      this.trackForm.patchValue({
        title: this.trackData.title,
        artist: this.trackData.artist,
        album: this.trackData.album ?? '',
        genres: this.trackData.genres ?? [],
        coverImage: this.trackData.coverImage ?? '',
      });
    }

    this.tracksService.getGenres().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.genres.set(res ?? []);
    })
  }

  close(): void {
    this.dialogRef.close({submitted: false, response: null});
  }

  submit(): void {
    if (this.trackForm.invalid) {
      return;
    }

    this.submitted.set(true);
    const request = {
      ...this.trackForm.value,
      coverImage: this.trackForm.value.coverImage ? this.trackForm.value.coverImage : DEFAULT_COVER_IMAGE,
    } as TrackCreateRequest;

    const trackUpdateObservable = this.creationMode() ? this.tracksService.createTrack(request) : this.tracksService.updateTrack(this.trackData.id, request);
    trackUpdateObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((response) => {
      this.submitted.set(false);
      this.dialogRef.close({submitted: true, response: response});
    })
  }

  toggleGenre(index: number) {
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
