import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TracksPageComponent } from '../../src/components/tracks-page/tracks-page.component';
import { TracksService } from '../../src/services';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { of } from 'rxjs';
import { TrackCollectionResponse, TrackSearchItem } from '../../src/types/track-api.type';


fdescribe('TracksPageComponent', () => {
  let component: TracksPageComponent;
  let fixture: ComponentFixture<TracksPageComponent>;
  let tracksServiceMock: jasmine.SpyObj<TracksService>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let matDialogRefMock: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(async () => {
    tracksServiceMock = jasmine.createSpyObj('TracksService', ['getTracks', 'getGenres']);
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    const activatedRouteMock = {
      queryParams: of({}) // Mock queryParams as an observable
    };

    await TestBed.configureTestingModule({
      imports: [TracksPageComponent], // As TracksPageComponent is standalone
      providers: [
        { provide: TracksService, useValue: tracksServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
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
      data: [{
        id: '1',
        title: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        genres: ['Test1', 'Test2'],
        slug: 'Test',
        createdAt: '2023-10-01T12:00:00Z',
        updatedAt: '2023-10-01T12:00:00Z',
      }],
      meta: {
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      }
    };
    const mockGenres = ['Test1', 'Test2'];

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
      data: [],
      meta: {
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      }
    };

    tracksServiceMock.getTracks.and.returnValue(of(mockTracksResponse));

    component.retrieveTracks();
    expect(component.tracks()).toEqual(mockTracksResponse.data);
  });

  it('should open dialog for creating a track', () => {
    const dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<any>>;
    dialogRef.afterClosed.and.returnValue(of());
    const dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialog.open.and.returnValue(dialogRef);

    component.createTrack();

    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog for editing a track', () => {
    const mockTrack: TrackSearchItem = {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['Test1', 'Test2'],
      slug: 'Test',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    };
    const dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<any>>;
    dialogRef.afterClosed.and.returnValue(of());
    const dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialog.open.and.returnValue(dialogRef);

    component.editTrack(mockTrack);

    expect(matDialogMock.open).toHaveBeenCalledWith(jasmine.any(Function), { data: mockTrack });
  });

  it('should open dialog for deleting a track', () => {
    const mockTrack: TrackSearchItem = {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['Test1', 'Test2'],
      slug: 'Test',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    };

    const dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<any>>;
    dialogRef.afterClosed.and.returnValue(of());
    const dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialog.open.and.returnValue(dialogRef);

    component.deleteTrack(mockTrack);

    expect(matDialogMock.open).toHaveBeenCalledWith(jasmine.any(Function), { data: { track: mockTrack } });
  });

  it('should reset filters and retrieve tracks', () => {
    spyOn(component, 'retrieveTracks');

    component.reset();
    expect(component.retrieveTracks).toHaveBeenCalled();
  });
});
