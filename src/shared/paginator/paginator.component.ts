import {Component, computed, input, output, signal} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div data-testid="pagination" class="paginator">
      <button data-testid="pagination-prev" mat-button color="primary"(click)="prevPage()" [disabled]="currentPage() === 1">Previous</button>
      <span class="paginator-content">{{ currentPage() }} of {{ totalPages() }}</span>
      <button data-testid="pagination-next" mat-button color="primary" (click)="nextPage()" [disabled]="currentPage() === totalPages()">Next</button>
    </div>
  `,
  styles: [`
    .paginator-content {
      padding: 0 8px;
    }
  `]
})
export class PaginatorComponent {
  pageSize = input<number>(10);
  length = input<number>(0);

  pageChange = output<number>();

  currentPage = signal<number>(1);

  totalPages = computed<number>(() => Math.ceil(this.length() / this.pageSize()));

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.pageChange.emit(this.currentPage());
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.pageChange.emit(this.currentPage());
    }
  }
}
