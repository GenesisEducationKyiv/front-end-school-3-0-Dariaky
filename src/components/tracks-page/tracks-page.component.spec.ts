import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TracksPageComponent } from './tracks-page.component';
import { TracksService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TrackCollectionResponse, TrackSearchItem } from '../../types/track-api.type';

describe('TracksPageComponent', () => {
  let component: TracksPageComponent;
  let fixture: ComponentFixture<TracksPageComponent>;
  let tracksServiceMock: jasmine.SpyObj<TracksService>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    tracksServiceMock = jasmine.createSpyObj('TracksService', ['getTracks', 'getGenres']);
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TracksPageComponent],
      providers: [
        { provide: TracksService, useValue: tracksServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TracksPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tracks and genres on ngOnInit', () => {
    const mockTracksResponse: TrackCollectionResponse = {
      data: [{ id: '1', name: 'Track 1', artist: 'Artist 1', genre: 'Genre 1' }],
      meta: { total: 1 },
    };
    const mockGenres = ['Genre 1', 'Genre 2'];

    tracksServiceMock.getTracks.and.returnValue(of(mockTracksResponse));
    tracksServiceMock.getGenres.and.returnValue(of(mockGenres));

    component.ngOnInit();

    expect(tracksServiceMock.getTracks).toHaveBeenCalled();
    expect(tracksServiceMock.getGenres).toHaveBeenCalled();
    expect(component.tracks()).toEqual(mockTracksResponse.data);
    expect(component.genresAvailable()).toEqual(mockGenres);
  });

  it('should retrieve tracks with filters', () => {
    const mockTracksResponse: TrackCollectionResponse = {
      data: [{ id: '1', name: 'Filtered Track', artist: 'Artist 1', genre: 'Genre 1' }],
      meta: { total: 1 },
    };

    tracksServiceMock.getTracks.and.returnValue(of(mockTracksResponse));

    component.retrieveTracks();

    expect(tracksServiceMock.getTracks).toHaveBeenCalledWith({
      page: component.page(),
      limit: component.limit(),
      sort: component.sort(),
      order: component.order(),
      search: component.search(),
      artist: component.artist(),
      genre: component.genre(),
    });
    expect(component.tracks()).toEqual(mockTracksResponse.data);
  });

  it('should open dialog for creating a track', () => {
    matDialogMock.open.and.returnValue({ afterClosed: () => of({ submitted: true }) } as any);

    component.createTrack();

    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog for editing a track', () => {
    const mockTrack: TrackSearchItem = { id: '1', name: 'Track 1', artist: 'Artist 1', genre: 'Genre 1' };
    matDialogMock.open.and.returnValue({ afterClosed: () => of({ submitted: true }) } as any);

    component.editTrack(mockTrack);

    expect(matDialogMock.open).toHaveBeenCalledWith(jasmine.any(Function), { data: mockTrack });
  });

  it('should open dialog for deleting a track', () => {
    const mockTrack: TrackSearchItem = { id: '1', name: 'Track 1', artist: 'Artist 1', genre: 'Genre 1' };
    matDialogMock.open.and.returnValue({ afterClosed: () => of({ submitted: true }) } as any);

    component.deleteTrack(mockTrack);

    expect(matDialogMock.open).toHaveBeenCalledWith(jasmine.any(Function), { data: { track: mockTrack } });
  });

  it('should reset filters and retrieve tracks', () => {
    spyOn(component, 'retrieveTracks');

    component.reset();

    expect(component.page()).toBe(1);
    expect(component.limit()).toBe(10);
    expect(component.sort()).toBe('createdAt');
    expect(component.order()).toBe('desc');
    expect(component.search()).toBe('');
    expect(component.artist()).toBe('');
    expect(component.genre()).toBe('');
    expect(component.retrieveTracks).toHaveBeenCalled();
  });
});
