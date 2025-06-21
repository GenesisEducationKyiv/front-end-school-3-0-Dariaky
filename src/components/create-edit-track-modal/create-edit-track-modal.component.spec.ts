import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditTrackModalComponent } from './create-edit-track-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TracksService } from '../../services';
import { of } from 'rxjs';
import { CreateEditModalData, TrackModalResult } from '../../types/track-modal.type';
import { DEFAULT_COVER_IMAGE } from '../../shared/utils/default-cover';

describe('CreateEditTrackModalComponent', () => {
  let component: CreateEditTrackModalComponent;
  let fixture: ComponentFixture<CreateEditTrackModalComponent>;
  let mockTracksService: jasmine.SpyObj<TracksService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CreateEditTrackModalComponent>>;
  const mockDialogData: CreateEditModalData = {
    id: '123',
    title: 'Test Title',
    artist: 'Test Artist',
    album: 'Test Album',
    genres: ['Rock'],
    coverImage: 'test-image.jpg',
  };

  beforeEach(async () => {
    mockTracksService = jasmine.createSpyObj('TracksService', ['getGenres', 'createTrack', 'updateTrack']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [CreateEditTrackModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: TracksService, useValue: mockTracksService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditTrackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with dialog data in edit mode', () => {
    expect(component.trackForm.value).toEqual({
      title: 'Test Title',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['Rock'],
      coverImage: 'test-image.jpg',
    });
  });

  it('should fetch genres on initialization', () => {
    const mockGenres = ['Rock', 'Pop', 'Jazz'];
    mockTracksService.getGenres.and.returnValue(of(mockGenres));

    component.ngOnInit();

    expect(component.genres()).toEqual(mockGenres);
  });

  it('should close the dialog with submitted true on close', () => {
    component.close();

    expect(mockDialogRef.close).toHaveBeenCalledWith({ submitted: true } as TrackModalResult);
  });

  it('should submit a new track creation request', () => {
    const mockResponse = { id: '456', title: 'New Track' };
    mockTracksService.createTrack.and.returnValue(of(mockResponse));

    component.trackForm.setValue({
      title: 'New Track',
      artist: 'New Artist',
      album: '',
      genres: ['Pop'],
      coverImage: '',
    });

    component.submit();

    expect(mockTracksService.createTrack).toHaveBeenCalledWith({
      title: 'New Track',
      artist: 'New Artist',
      album: '',
      genres: ['Pop'],
      coverImage: DEFAULT_COVER_IMAGE,
    });
    expect(mockDialogRef.close).toHaveBeenCalledWith({ submitted: true, response: mockResponse } as TrackModalResult);
  });

  it('should submit an update request for an existing track', () => {
    const mockResponse = { id: '123', title: 'Updated Track' };
    mockTracksService.updateTrack.and.returnValue(of(mockResponse));

    component.trackForm.setValue({
      title: 'Updated Track',
      artist: 'Updated Artist',
      album: 'Updated Album',
      genres: ['Rock'],
      coverImage: 'updated-image.jpg',
    });

    component.submit();

    expect(mockTracksService.updateTrack).toHaveBeenCalledWith('123', {
      title: 'Updated Track',
      artist: 'Updated Artist',
      album: 'Updated Album',
      genres: ['Rock'],
      coverImage: 'updated-image.jpg',
    });
    expect(mockDialogRef.close).toHaveBeenCalledWith({ submitted: true, response: mockResponse } as TrackModalResult);
  });

  it('should toggle genre selection correctly', () => {
    component.genres.set(['Rock', 'Pop', 'Jazz']);
    component.trackForm.get('genres')?.setValue(['Rock']);

    component.toggleGenre(1);

    expect(component.trackForm.get('genres')?.value).toEqual(['Rock', 'Pop']);
  });

  it('should check if a genre is selected', () => {
    component.genres.set(['Rock', 'Pop', 'Jazz']);
    component.trackForm.get('genres')?.setValue(['Rock']);

    expect(component.isSelected(0)).toBeTrue();
    expect(component.isSelected(1)).toBeFalse();
  });
});
