import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TracksService } from '../../src/services/tracks.service';
import { TrackCollectionResponse, TrackSearchItem } from '../../src/types/track-api.type';

describe('TracksService', () => {
  let service: TracksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TracksService],
    });

    service = TestBed.inject(TracksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tracks', () => {
    const mockResponse: TrackCollectionResponse = {
      data: [],
      meta: {
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      },
    };

    service.getTracks().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/tracks');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a track', () => {
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
    const trackRequest = {
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['Test1', 'Test2'],
      coverImage: '',
    };

    service.createTrack(trackRequest).subscribe((response) => {
      expect(response).toEqual(mockTrack);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/tracks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(trackRequest);
    req.flush(mockTrack);
  });

  it('should update a track', () => {
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
    const trackRequest = {
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['Test1', 'Test2'],
      coverImage: '',
    };

    service.updateTrack('1', trackRequest).subscribe((response) => {
      expect(response).toEqual(mockTrack);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/tracks/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(trackRequest);
    req.flush(mockTrack);
  });

  it('should delete a track', () => {
    service.deleteTrack('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8000/api/tracks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should upload a track file', () => {
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
    const mockFile = new File(['content'], 'test.mp3');

    service.uploadTrackFile('1', mockFile).subscribe((response) => {
      expect(response).toEqual(mockTrack);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/tracks/1/upload');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush(mockTrack);
  });

  it('should delete a track file', () => {
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

    service.deleteTrackFile('1').subscribe((response) => {
      expect(response).toEqual(mockTrack);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/tracks/1/file');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockTrack);
  });

  it('should fetch genres', () => {
    const mockGenres = ['Rock', 'Pop', 'Jazz'];

    service.getGenres().subscribe((response) => {
      expect(response).toEqual(mockGenres);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/genres');
    expect(req.request.method).toBe('GET');
    req.flush(mockGenres);
  });
});
