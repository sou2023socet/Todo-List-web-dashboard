import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav *ngIf="totalPages > 1" class="flex items-center justify-center space-x-2" aria-label="Pagination">
      <button (click)="prev()" [disabled]="currentPage <= 0" class="px-2 py-1">Prev</button>
      <span class="px-2">{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button (click)="next()" [disabled]="currentPage >= totalPages - 1" class="px-2 py-1">Next</button>
    </nav>
  `
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  prev(): void {
    if (this.currentPage > 0) this.pageChange.emit(this.currentPage - 1);
  }

  next(): void {
    if (this.currentPage < this.totalPages - 1) this.pageChange.emit(this.currentPage + 1);
  }
}
