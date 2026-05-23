import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="toast$() as toast" class="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded shadow-lg z-50 w-80">
      <div class="flex items-center justify-between gap-4">
        <span>{{ toast.text }}</span>
        <button type="button" (click)="toastService.clear()" class="text-white/80 hover:text-white">✕</button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toast$!: any;

  constructor(public toastService: ToastService) {
    this.toast$ = this.toastService.toast;
  }
}
