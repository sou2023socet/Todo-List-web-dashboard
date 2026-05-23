import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../../models/todo.interface';
import { Status } from '../../../../models/status.enum';
import { Priority } from '../../../../models/priority.enum';

@Component({
  selector: 'app-todo-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Topic</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Summary</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Priority</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Section</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr *ngFor="let todo of todos">
            <td class="px-4 py-3 text-sm text-gray-900">{{ todo.topic }}</td>
            <td class="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">{{ todo.summaryPoints }}</td>
            <td class="px-4 py-3 text-sm">{{ todo.status }}</td>
            <td class="px-4 py-3 text-sm">{{ todo.priority }}</td>
            <td class="px-4 py-3 text-sm">{{ todo.section }}</td>
            <td class="px-4 py-3 text-right text-sm">
              <button type="button" (click)="edit.emit(todo)" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
              <button type="button" (click)="delete.emit(todo)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TodoTableComponent {
  @Input() todos: Todo[] | null = [] as any;
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();
}
