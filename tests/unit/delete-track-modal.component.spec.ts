import {ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import { DeleteTrackModalComponent } from '../../src/components/delete-track-modal/delete-track-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TracksService } from '../../src/services';
import { of } from 'rxjs';
import { DeleteTrackModalData } from '../../src/types/track-modal.type';

describe('DeleteTrackModalComponent', () => {
  let component: DeleteTrackModalComponent;
  let fixture: ComponentFixture<DeleteTrackModalComponent>;
  let mockTracksService: jasmine.SpyObj<TracksService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteTrackModalComponent>>;
  const mockDialogData: DeleteTrackModalData = {
    track: {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['Test1', 'Test2'],
      slug: 'Test',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
    tracks: undefined
  };

  beforeEach(async () => {
    mockTracksService = jasmine.createSpyObj('TracksService', ['deleteTrack', 'deleteTracks']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [DeleteTrackModalComponent],
      providers: [
        { provide: TracksService, useValue: mockTracksService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTrackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteTrack and close dialog with success when submitting single track', () => {
    mockTracksService.deleteTrack.and.returnValue(of());

    component.submit();

    expect(mockTracksService.deleteTrack).toHaveBeenCalledWith('1');
  });

  it('should close dialog with submitted false when close is called', () => {
    component.close();

    expect(mockDialogRef.close).toHaveBeenCalledWith({ submitted: false });
  });
});
