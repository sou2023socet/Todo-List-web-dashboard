import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, of } from 'rxjs';
import { Todo } from '../../models/todo.interface';
import { TodoService } from './services/todo.service';
import { SectionResponse } from '../../models/section-response.interface';
import { ToastService } from '../../ui-kit/components/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  private sectionsSubject = new BehaviorSubject<SectionResponse[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  todos$ = this.todosSubject.asObservable();
  sections$ = this.sectionsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private todoService: TodoService, private toast: ToastService) {}

  loadTodos(page = 0, size = 20): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    this.todoService.list(page, size, true).pipe(
      catchError(err => { this.errorSubject.next(err?.message || 'Failed to load todos'); return of([]); }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe((res: any) => {
      // API may return ApiResponse wrapper; handle both
      const data = res?.data ?? res;
      this.todosSubject.next(Array.isArray(data) ? data : (data?.content ?? []));
    });
  }

  loadSections(): void {
    this.todoService.listSections().pipe(
      catchError(err => { this.errorSubject.next(err?.message || 'Failed to load sections'); return of([]); })
    ).subscribe((res: any) => {
      const data = res?.data ?? res;
      this.sectionsSubject.next(data ?? []);
    });
  }

  createTodo(request: any): void {
    this.loadingSubject.next(true);
    this.todoService.create(request).pipe(
      catchError(err => { this.errorSubject.next(err?.message || 'Create failed'); return of(null); }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe((res: any) => {
      const created = res?.data ?? res;
      const current = this.todosSubject.value ?? [];
      if (created) this.todosSubject.next([created, ...current]);
      if (created) this.toast.show('Todo created', 'success');
    });
  }

  updateTodo(id: string, request: any): void {
    this.loadingSubject.next(true);
    this.todoService.update(id, request).pipe(
      catchError(err => { this.errorSubject.next(err?.message || 'Update failed'); return of(null); }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe((res: any) => {
      const updated = res?.data ?? res;
      if (updated) {
        const current = this.todosSubject.value;
        this.todosSubject.next(current.map(todo => todo.id === id ? updated : todo));
        this.toast.show('Todo updated', 'success');
      }
    });
  }

  deleteTodo(id: string): void {
    this.todoService.delete(id).pipe(
      catchError(err => { this.errorSubject.next(err?.message || 'Delete failed'); return of(null); })
    ).subscribe(() => {
      const filtered = this.todosSubject.value.filter(t => t.id !== id);
      this.todosSubject.next(filtered);
      this.toast.show('Todo deleted', 'success');
    });
  }
}
