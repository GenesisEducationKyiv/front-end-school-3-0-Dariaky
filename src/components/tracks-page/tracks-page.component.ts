import { Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, delay, distinctUntilChanged, Subject } from 'rxjs';

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

  // Pagination and Filters
  page = signal<number>(1);
  limit = signal<number>(10);
  pageTotal = signal<number>(0);
  sort = signal<TrackSort>('createdAt');
  order = signal<TrackOrder>('desc');
  search = signal<string>('');
  artist = signal<string>('');
  genre = signal<string>('');

  artistsAvailable = computed<string[]>(() => this.originalTracks().length ? [...new Set(this.originalTracks().map((track) => track.artist))] : []);
  genresAvailable = signal<string[]>([]);

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
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

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((searchTerm: string) => {
      this.search.set(searchTerm);
      this.retrieveTracks();
    });
  }

  retrieveTracks(): void {
    this.loading.set(true);
    this.tracksService.getTracks({
      page: this.page(),
      limit: this.limit(),
      sort: this.sort(),
      order: this.order(),
      search: this.search(),
      artist: this.artist(),
      genre: this.genre()
    }).pipe(takeUntilDestroyed(this.destroyRef), delay(1000))
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
    this.page.set(page);
    this.retrieveTracks();
  }

  sortChanged(sort: TrackSort): void {
    this.sort.set(sort);
    this.retrieveTracks();
  }

  orderChanged(order: TrackOrder): void {
    this.order.set(order);
    this.retrieveTracks();
  }

  searchChanged($event: Event): void {
    const inputElement = $event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value);
  }

  artistChanged(artist: string): void {
    this.artist.set(artist);
    this.retrieveTracks();
  }

  genreChanged(genre: string): void {
    this.genre.set(genre);
    this.retrieveTracks();
  }

  reset(): void {
    this.page.set(1);
    this.limit.set(10);
    this.sort.set('createdAt');
    this.order.set('desc');
    this.search.set('');
    this.artist.set('');
    this.genre.set('');

    this.artistsSelect()?.options.forEach((data: MatOption) => data.deselect());
    this.genresSelect()?.options.forEach((data: MatOption) => data.deselect());
    this.orderSelect()?.options.forEach((data: MatOption) => data.deselect());
    this.sortSelect()?.options.forEach((data: MatOption) => data.deselect());

    const trackSearchInput = this.trackSearch()?.nativeElement;
    if (trackSearchInput) {
      trackSearchInput.value = '';
    }

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
}
