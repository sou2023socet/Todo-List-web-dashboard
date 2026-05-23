import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TodoFacade } from '../../todo-facade.service';
import { TodoTableComponent } from '../../components/todo-table/todo-table.component';
import { LoadingSpinnerComponent } from '../../../../ui-kit/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../../ui-kit/components/pagination/pagination.component';
import { ModalComponent } from '../../../../ui-kit/components/modal/modal.component';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { Todo } from '../../../../models/todo.interface';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, TodoTableComponent, LoadingSpinnerComponent, PaginationComponent, ModalComponent, TodoFormComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Todos (Refactored)</h1>
        <button (click)="openForm()" class="bg-blue-500 text-white py-2 px-4 rounded">Add Todo</button>
      </div>

      <app-loading-spinner *ngIf="loading$ | async"></app-loading-spinner>

      <app-todo-table
        *ngIf="(loading$ | async) === false"
        [todos]="(todos$ | async) || []"
        (delete)="onDelete($event)">
      </app-todo-table>

      <div class="mt-4">
        <app-pagination (pageChange)="onPageChange($event)"></app-pagination>
      </div>

      <app-modal title="{{ selectedTodo ? 'Edit Todo' : 'Add Todo' }}" [isOpen]="isFormOpen" (closed)="closeForm()">
        <app-todo-form
          [todo]="selectedTodo"
          [sections]="sections"
          (save)="onSave($event)"
          (cancel)="closeForm()">
        </app-todo-form>
      </app-modal>
    </div>
  `
})
export class DashboardPageComponent {
  todos$!: Observable<Todo[]>;
  loading$!: Observable<boolean>;
  sections: string[] = [];
  isFormOpen = false;
  selectedTodo: Todo | null = null;

  constructor(private facade: TodoFacade) {
    this.todos$ = this.facade.todos$;
    this.loading$ = this.facade.loading$;
    this.facade.loadTodos();
    this.facade.loadSections();
    this.facade.sections$.subscribe(sections => this.sections = sections.map(s => (s as any).name ?? s));
  }

  onDelete(todo: any): void {
    if (confirm('Delete todo?')) this.facade.deleteTodo(todo.id);
  }

  openForm(todo: Todo | null = null): void {
    this.selectedTodo = todo;
    this.isFormOpen = true;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.selectedTodo = null;
  }

  onSave(todo: Todo): void {
    if (todo.id) {
      this.facade.updateTodo(todo.id, todo as any);
    } else {
      this.facade.createTodo(todo as any);
    }
    this.closeForm();
  }

  onPageChange(page: number): void {
    this.facade.loadTodos(page);
  }
}
