import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteTrackModalComponent } from './delete-track-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TracksService } from '../../services';
import { of } from 'rxjs';
import { DeleteTrackModalData } from '../../types/track-modal.type';

describe('DeleteTrackModalComponent', () => {
  let component: DeleteTrackModalComponent;
  let fixture: ComponentFixture<DeleteTrackModalComponent>;
  let mockTracksService: jasmine.SpyObj<TracksService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteTrackModalComponent>>;
  const mockDialogData: DeleteTrackModalData = { trackData: { track: { id: '123' } } };

  beforeEach(async () => {
    mockTracksService = jasmine.createSpyObj('TracksService', ['deleteTrack', 'deleteTracks']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [DeleteTrackModalComponent],
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
    mockTracksService.deleteTrack.and.returnValue(of({}));

    component.submit();

    expect(mockTracksService.deleteTrack).toHaveBeenCalledWith('123');
    expect(mockDialogRef.close).toHaveBeenCalledWith({ submitted: true });
  });

  it('should call deleteTracks and close dialog with success when submitting multiple tracks', () => {
    const mockTracksData = { tracks: ['123', '456'] };
    component.trackData = mockTracksData;
    mockTracksService.deleteTracks.and.returnValue(of({}));

    component.submit();

    expect(mockTracksService.deleteTracks).toHaveBeenCalledWith(['123', '456']);
    expect(mockDialogRef.close).toHaveBeenCalledWith({ submitted: true });
  });

  it('should close dialog with submitted false when close is called', () => {
    component.close();

    expect(mockDialogRef.close).toHaveBeenCalledWith({ submitted: false });
  });
});
