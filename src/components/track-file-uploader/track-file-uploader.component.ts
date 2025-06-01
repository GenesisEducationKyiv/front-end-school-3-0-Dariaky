import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  viewChild
} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {TracksService} from "../../services";
import {delay, fromEvent} from "rxjs";
import {ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MIN_FILE_SIZE} from "../../shared/utils/audio-params";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'track-file-uploader',
  standalone: true,
    imports: [MatButtonModule],
  template: `
    @if (trackAudioFile()) {
      <audio [attr.data-testid]="'audio-player-' + trackId()" class="file-audio" controls [src]="trackAudioFilePlayable()"></audio>


      <div class="file-audio-actions">
        <div>
          <input #fileUploadInput type="file" />
          <button mat-flat-button color="primary" (click)="openFileUploadInput()">Reupload</button>
        </div>
        <button mat-flat-button color="warn" (click)="deleteFile()">Delete</button>
      </div>
    }
    @else {
      <div>
        <input #fileUploadInput type="file" />
        <button [attr.data-testid]="'upload-track-' + trackId()" mat-flat-button color="primary" (click)="openFileUploadInput()">Upload audio</button>
      </div>
    }
  `,
  styles: [`
    input[type="file"] {
      display: none;
    }
    .file-audio {
      width: 100%;
    }
    .file-audio-actions {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `]
})

export class TrackFileUploaderComponent implements AfterViewInit {
  private readonly trackService = inject(TracksService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar)

  fileUploadInput = viewChild<ElementRef>('fileUploadInput');

  trackId = input<string>('');
  trackAudioFile = input<string>('');

  trackAudioFilePlayable = computed(() => this.trackAudioFile() ? `https://localhost:8000/data/uploads/${this.trackAudioFile()}` : '');

  fileUploaded = output<void>();

  ngAfterViewInit() {
    if (this.fileUploadInput()) {
      fromEvent(this.fileUploadInput()?.nativeElement, 'change')
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          delay(50)
        )
        .subscribe(() => {
          const uploadedFile = this.fileUploadInput()?.nativeElement.files[0];
          console.log('uploadedFile', uploadedFile);
          if (!this.isFileValid(uploadedFile)) {
            return;
          }
          this.upload(uploadedFile);
        });
    }}

  openFileUploadInput(): void {
    this.fileUploadInput()?.nativeElement.click();
  }

  upload(file: File) {
      this.trackService.uploadTrackFile(this.trackId(), file).subscribe({
        next: (_) => {
          this.openSnackBar('File uploaded successfully!');
          this.fileUploaded.emit();
        },
        error: (err) => {
          this.openSnackBar(`Error: ${err.message}`);
        },
      });
  }

  deleteFile() {
    this.trackService.deleteTrackFile(this.trackId()).subscribe({
      next: (_) => {
        this.openSnackBar('File deleted successfully!');
        this.fileUploaded.emit();
      },
      error: (err) => {
        this.openSnackBar(`Error: ${err.message}`);
      },
    })
  }

  private isFileValid(file: File): boolean {
    if (!file) {
      return false;
    }

    if (!this.isValidFileType(file)) {
      this.openSnackBar('Invalid file type. Make sure your file type is ".mp3", ".wav", ".aac" or ".flac"');
      return false;
    }

    if (file.size < MIN_FILE_SIZE) {
      this.openSnackBar('File too small. Make sure your file is larger than 10KB.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.openSnackBar('File too large. Make sure your file is smaller than 50MB.');
      return false;
    }
    return true;
  }

  private isValidFileType(file: File): boolean {
    for (const allowedFileType of ALLOWED_FILE_TYPES) {
      if (file.name.endsWith(allowedFileType)) {
        return true;
      }
    }
    return false;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}
