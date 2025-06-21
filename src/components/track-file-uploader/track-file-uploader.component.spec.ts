import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackFileUploaderComponent } from './track-file-uploader.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TracksService } from '../../services';
import { of, throwError } from 'rxjs';
import { ElementRef } from '@angular/core';

describe('TrackFileUploaderComponent', () => {
  let component: TrackFileUploaderComponent;
  let fixture: ComponentFixture<TrackFileUploaderComponent>;
  let mockTracksService: jasmine.SpyObj<TracksService>;

  beforeEach(async () => {
    mockTracksService = jasmine.createSpyObj('TracksService', ['uploadTrackFile', 'deleteTrackFile']);

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [TrackFileUploaderComponent],
      providers: [{ provide: TracksService, useValue: mockTracksService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackFileUploaderComponent);
    component = fixture.componentInstance;

    // Mocking the fileUploadInput ElementRef
    component.fileUploadInput = new ElementRef({
      nativeElement: {
        files: [],
        click: jasmine.createSpy('click'),
      },
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open file upload input when openFileUploadInput is called', () => {
    component.openFileUploadInput();
    expect(component.fileUploadInput()?.nativeElement.click).toHaveBeenCalled();
  });

  it('should validate file type correctly', () => {
    const validFile = new File(['content'], 'test.mp3', { type: 'audio/mp3' });
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });

    expect(component['isValidFileType'](validFile)).toBeTrue();
    expect(component['isValidFileType'](invalidFile)).toBeFalse();
  });

  it('should upload a valid file', () => {
    const validFile = new File(['content'], 'test.mp3', { type: 'audio/mp3' });
    mockTracksService.uploadTrackFile.and.returnValue(of({}));

    component.upload(validFile);

    expect(mockTracksService.uploadTrackFile).toHaveBeenCalledWith(component.trackId(), validFile);
  });

  it('should show error message when upload fails', () => {
    const validFile = new File(['content'], 'test.mp3', { type: 'audio/mp3' });
    mockTracksService.uploadTrackFile.and.returnValue(throwError(() => new Error('Upload failed')));

    spyOn(component, 'openSnackBar');

    component.upload(validFile);

    expect(component.openSnackBar).toHaveBeenCalledWith('Error: Upload failed');
  });

  it('should delete a file successfully', () => {
    mockTracksService.deleteTrackFile.and.returnValue(of({}));

    component.deleteFile();

    expect(mockTracksService.deleteTrackFile).toHaveBeenCalledWith(component.trackId());
  });

  it('should show error message when delete fails', () => {
    mockTracksService.deleteTrackFile.and.returnValue(throwError(() => new Error('Delete failed')));

    spyOn(component, 'openSnackBar');

    component.deleteFile();

    expect(component.openSnackBar).toHaveBeenCalledWith('Error: Delete failed');
  });
});
