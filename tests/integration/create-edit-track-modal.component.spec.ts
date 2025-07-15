import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateEditTrackModalComponent } from '../../src/components/create-edit-track-modal/create-edit-track-modal.component';
import { TracksService } from '../../src/services';
import { of } from 'rxjs';

describe('CreateEditTrackModalComponent Integration Test', () => {
  let fixture: ComponentFixture<CreateEditTrackModalComponent>;
  let component: CreateEditTrackModalComponent;

  beforeEach(async () => {
    const tracksServiceMock = jasmine.createSpyObj('TracksService', ['deleteTrack', 'deleteTracks', 'getGenres']);
    tracksServiceMock.getGenres.and.returnValue(of(['Rock', 'Pop', 'Jazz']));


    await TestBed.configureTestingModule({
      imports: [
        CreateEditTrackModalComponent,
        ReactiveFormsModule,
        MatDialogModule,
        BrowserAnimationsModule, // Required for Material components
      ],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: MAT_DIALOG_DATA, useValue: { editMode: false } },
        { provide: TracksService, useValue: tracksServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditTrackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should render the form and validate user input', () => {
    const formElement = fixture.nativeElement.querySelector('[data-testid="track-form"]');
    expect(formElement).toBeTruthy();

    // Form Control
    const titleControl = component.trackForm.get('title');
    titleControl?.setValue('');
    titleControl?.markAsTouched();
    fixture.detectChanges();

    const errorTitle = fixture.nativeElement.querySelector('[data-testid="error-title"]');
    expect(errorTitle).toBeTruthy();
    expect(errorTitle.textContent).toContain('Track title is required');

    // HTML Value
    const titleInput = fixture.nativeElement.querySelector('[data-testid="input-title"]');
    titleInput.value = 'Test Title';
    titleInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(titleInput.value).toBe('Test Title');
  });

  it('should submit the form when valid', () => {
    spyOn(component, 'submit');

    component.trackForm.setValue({
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['Rock'],
      coverImage: 'test-image.jpg',
    });

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('[data-testid="submit-button"]');
    expect(submitButton.disabled).toBeFalse();

    submitButton.click();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
  });
});
