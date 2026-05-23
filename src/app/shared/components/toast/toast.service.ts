import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<ToastMessage | null>(null);

  show(text: string, type: ToastType = 'info'): void {
    this.toast.set({ id: Date.now(), text, type });
    setTimeout(() => this.toast.set(null), 4000);
  }

  clear(): void {
    this.toast.set(null);
  }
}
