import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <button type="button" class="text-gray-500 hover:text-gray-700" (click)="closed.emit()">✕</button>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() title = '';
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
}
