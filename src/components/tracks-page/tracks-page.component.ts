import { Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, delay, distinctUntilChanged, Subject } from 'rxjs';

import { O, pipe } from '@mobily/ts-belt';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCheckbox } from '@angular/material/checkbox';

import { TrackCollectionResponse, TrackOrder, TrackSearchItem, TrackSort } from '../../types/track-api.type';
import { CreateEditTrackModalComponent } from '../create-edit-track-modal/create-edit-track-modal.component';
import { DeleteTrackModalComponent } from '../delete-track-modal/delete-track-modal.component';
import { TrackFileUploaderComponent } from '../track-file-uploader/track-file-uploader.component';
import { DEFAULT_COVER_IMAGE } from '../../shared/utils/default-cover';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { TracksService} from '../../services';


@Component({
  selector: 'tracks-page',
  templateUrl: 'tracks-page.component.html',
  styleUrl: 'tracks-page.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    TrackFileUploaderComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    PaginatorComponent,
    MatProgressSpinner,
    MatCheckbox,
  ]
})
export class TracksPageComponent implements OnInit {
  private readonly tracksService = inject<TracksService>(TracksService);
  private readonly destroyRef = inject<DestroyRef>(DestroyRef);
  private readonly dialog = inject<MatDialog>(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  DEFAULT_COVER_IMAGE = DEFAULT_COVER_IMAGE;

  artistsSelect = viewChild<MatSelect>('artistsSelect');
  genresSelect = viewChild<MatSelect>('genresSelect');
  orderSelect = viewChild<MatSelect>('orderSelect');
  sortSelect = viewChild<MatSelect>('sortSelect');
  trackSearch = viewChild<ElementRef>('trackSearch');

  tracks = signal<TrackSearchItem[]>([]);
  originalTracks = signal<TrackSearchItem[]>([]);
  loading = signal<boolean>(false);
  selectedTracks = signal<string[]>([]);

  // Pagination
  LIMIT = 10;
  pageTotal = signal<number>(0);

  artistsAvailable = computed<string[]>(() => this.originalTracks().length ? [...new Set(this.originalTracks().map((track) => track.artist))] : []);
  genresAvailable = signal<string[]>([]);

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const filters = this.parseFilters(params);
      this.retrieveTracks(filters);
    });


    this.loading.set(true);
    this.tracksService.getTracks().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: (TrackCollectionResponse | null)) => {
        if (res) {
          this.tracks.set(res.data);
          this.originalTracks.set(res.data);
          this.pageTotal.set(res.meta.total);
        }
        this.loading.set(false);
      })

    this.tracksService.getGenres().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((genres: string[] | null) => {
        if (genres && Array.isArray(genres)) {
          this.genresAvailable.set(genres);
        }
      });

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.updateQueryParams({ search: searchTerm });
    });
  }

  retrieveTracks(filters: {
    page?: number;
    limit?: number;
    sort?: TrackSort;
    order?: TrackOrder;
    search?: O.Option<string>;
    artist?: O.Option<string>;
    genre?: O.Option<string>;
  } = {}): void {
    this.loading.set(true);

    const queryParams = {
      page: filters.page,
      limit: filters.limit,
      sort: filters.sort,
      order: filters.order,
      search: O.getWithDefault(filters.search, ''),
      artist: O.getWithDefault(filters.artist, ''),
      genre: O.getWithDefault(filters.genre, ''),
    };

    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined && value !== '')
    );

    this.tracksService.getTracks(filteredParams).pipe(takeUntilDestroyed(this.destroyRef), delay(1000))
      .subscribe((res: TrackCollectionResponse | null) => {
        if (res) {
          this.tracks.set(res.data);
          this.pageTotal.set(res.meta.total);
        }
        this.loading.set(false);
      })
  }

  createTrack(): void {
    const dialogRef = this.dialog.open<CreateEditTrackModalComponent>(CreateEditTrackModalComponent);

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({submitted}) => {
      if (submitted) {
        this.retrieveTracks();
      }
    });
  }

  editTrack(track: TrackSearchItem): void {
    const dialogRef = this.dialog.open<CreateEditTrackModalComponent>(CreateEditTrackModalComponent, {
      data: track
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({submitted}) => {
      if (submitted) {
        this.retrieveTracks();
      }
    });
  }

  deleteTrack(track: TrackSearchItem): void {
    const dialogRef = this.dialog.open<DeleteTrackModalComponent>(DeleteTrackModalComponent, {
      data: {
        track: track,
      }
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({submitted}) => {
      if (submitted) {
        this.retrieveTracks();
      }
    });
  }

  onPageChange(page: number): void {
    this.updateQueryParams({ page });
  }

  sortChanged(sort: TrackSort): void {
    this.updateQueryParams({ sort });
  }

  orderChanged(order: TrackOrder): void {
    this.updateQueryParams({ order });
  }

  artistChanged(artist: string): void {
    this.updateQueryParams({ artist });
  }

  genreChanged(genre: string): void {
    this.updateQueryParams({ genre });
  }

  searchChanged($event: Event): void {
    const inputElement = $event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value);
  }

  reset(): void {
    this.artistsSelect()?.options.forEach((data: MatOption) => data.deselect());
    this.genresSelect()?.options.forEach((data: MatOption) => data.deselect());
    this.orderSelect()?.options.forEach((data: MatOption) => data.deselect());
    this.sortSelect()?.options.forEach((data: MatOption) => data.deselect());

    const trackSearchInput = this.trackSearch()?.nativeElement;
    if (trackSearchInput) {
      trackSearchInput.value = '';
    }

    // Remove all query parameters, including 'search'
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: ''
    });

    this.retrieveTracks();
  }

  toggleTracksSelection(trackId: string): void {
    if (this.selectedTracks().includes(trackId)) {
      this.selectedTracks.set(this.selectedTracks().filter((id) => id !== trackId));
    } else {
      this.selectedTracks.set([...this.selectedTracks(), trackId]);
    }
  }

  deleteMultiple(): void {
    const dialogRef = this.dialog.open<DeleteTrackModalComponent>(DeleteTrackModalComponent, {
      data: {
        tracks: this.selectedTracks(),
      }
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({submitted}) => {
      if (submitted) {
        this.retrieveTracks();
      }
    });
  }

  private parseFilters(params: Record<string, any>) {
    return {
      page: pipe(O.fromNullable(params['page']), O.map(() => 1 as const), O.getWithDefault(1)),
      limit: pipe(O.fromNullable(params['limit']), O.map(() => 10 as const), O.getWithDefault(10)),
      sort: pipe(O.fromNullable(params['sort']), O.getWithDefault<TrackSort>('createdAt')),
      order: pipe(O.fromNullable(params['order']), O.getWithDefault<TrackOrder>('desc')),
      search: O.fromNullable(params['search']),
      artist: O.fromNullable(params['artist']),
      genre: O.fromNullable(params['genre']),
    };
  }

  private updateQueryParams(params: Partial<Record<string, any>>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
