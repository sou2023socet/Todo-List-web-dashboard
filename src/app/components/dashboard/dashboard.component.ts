import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Todo } from '../../models/todo.interface';
import { PageResponse } from '../../models/page-response.interface';
import { Status } from '../../models/status.enum';
import { Priority } from '../../models/priority.enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-md">
        <div class="p-4">
          <h2 class="text-lg font-semibold">Todo Dashboard</h2>
          <p class="text-sm text-gray-600">Tenant: {{ currentUser?.tenantId }}</p>
          <p class="text-sm text-gray-600">User: {{ currentUser?.username }}</p>
        </div>
        <nav class="mt-4">
          <a (click)="loadAllTodos()" class="block px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">All Tasks</a>
          <div *ngFor="let section of sections" (click)="loadTodosBySection(section)" class="block px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer">
            {{ section }}
          </div>
          <button (click)="addSection()" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200">+ Add Section</button>
        </nav>
        <div class="p-4">
          <button (click)="logout()" class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Logout</button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-6">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Todos</h1>
          <button (click)="openAddTodoModal()" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Todo</button>
        </div>

        <!-- Table -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let todo of todos" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(todo.createdAt) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ todo.topic }}</td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ todo.summaryPoints }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="getStatusClass(todo.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ todo.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="getPriorityClass(todo.priority)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ todo.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ todo.section }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="relative">
                    <button (click)="toggleMenu(todo)" class="text-gray-400 hover:text-gray-600">⋮</button>
                    <div *ngIf="selectedTodo?.id === todo.id && showMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div class="py-1">
                        <button (click)="editTodo(todo)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Edit</button>
                        <button (click)="deleteTodo(todo)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Delete</button>
                        <button (click)="copyTodo(todo)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Copy</button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-between items-center">
          <button [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)" class="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50">Previous</button>
          <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button [disabled]="currentPage >= totalPages - 1" (click)="changePage(currentPage + 1)" class="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Todo Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" (click)="closeModal()">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900">{{ isEdit ? 'Edit Todo' : 'Add Todo' }}</h3>
          <form (ngSubmit)="saveTodo()" class="mt-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Topic</label>
              <input [(ngModel)]="todoForm.topic" name="topic" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Summary</label>
              <textarea [(ngModel)]="todoForm.summaryPoints" name="summaryPoints" rows="3" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Section</label>
              <select [(ngModel)]="todoForm.section" name="section" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option *ngFor="let section of sections" [value]="section">{{ section }}</option>
                <option value="new">+ Add New</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select [(ngModel)]="todoForm.status" name="status" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Priority</label>
              <select [(ngModel)]="todoForm.priority" name="priority" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option *ngFor="let priority of priorityOptions" [value]="priority">{{ priority }}</option>
              </select>
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" (click)="closeModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">Cancel</button>
              <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
  // styles: [`
  //   .truncate {
  //     max-width: 200px;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //   }
  // `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  sections: string[] = [];
  todos: Todo[] = [];
  currentPage = 0;
  totalPages = 1;
  selectedSection: string | null = null;
  showModal = false;
  showMenu = false;
  selectedTodo: Todo | null = null;
  isEdit = false;
  todoForm: any = {
    topic: '',
    summaryPoints: '',
    section: '',
    status: Status.PENDING,
    priority: Priority.MEDIUM
  };

  statusOptions = Object.values(Status);
  priorityOptions = Object.values(Priority);

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadSections();
    this.loadAllTodos();
  }

  loadSections(): void {
    this.todoService.getSections().subscribe(sections => {
      this.sections = sections;
    });
  }

  loadAllTodos(): void {
    this.selectedSection = null;
    this.loadTodos();
  }

  loadTodosBySection(section: string): void {
    this.selectedSection = section;
    this.loadTodos();
  }

  loadTodos(): void {
    const observable = this.selectedSection
      ? this.todoService.getTodosBySection(this.selectedSection, this.currentPage)
      : this.todoService.getTodos(this.currentPage);
    observable.subscribe((response: any) => {
      if (Array.isArray(response)) {
        this.todos = response;
        this.totalPages = 1;
      } else {
        this.todos = response.content;
        this.totalPages = response.totalPages;
      }
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadTodos();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case Status.PENDING: return 'bg-yellow-100 text-yellow-800';
      case Status.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case Status.COMPLETED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case Priority.LOW: return 'bg-green-100 text-green-800';
      case Priority.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case Priority.HIGH: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  toggleMenu(todo: Todo): void {
    this.selectedTodo = this.selectedTodo?.id === todo.id ? null : todo;
    this.showMenu = !this.showMenu;
  }

  editTodo(todo: Todo): void {
    this.isEdit = true;
    this.todoForm = { ...todo };
    this.showModal = true;
    this.showMenu = false;
  }

  deleteTodo(todo: Todo): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(todo.id).subscribe(() => {
        this.loadTodos();
      });
    }
    this.showMenu = false;
  }

  copyTodo(todo: Todo): void {
    this.isEdit = false;
    const { id, createdAt, updatedAt, ...copyForm } = todo;
    this.todoForm = copyForm;
    this.showModal = true;
    this.showMenu = false;
  }

  openAddTodoModal(): void {
    this.isEdit = false;
    this.todoForm = {
      topic: '',
      summaryPoints: '',
      section: this.sections[0] || '',
      status: Status.PENDING,
      priority: Priority.MEDIUM
    };
    this.showModal = true;
  }

  saveTodo(): void {
    const observable = this.isEdit
      ? this.todoService.updateTodo(this.todoForm.id, this.todoForm)
      : this.todoService.createTodo(this.todoForm);
    observable.subscribe(() => {
      this.closeModal();
      this.loadTodos();
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTodo = null;
  }

  addSection(): void {
    const sectionName = prompt('Enter new section name:');
    if (sectionName) {
      this.sections.push(sectionName);
      // In a real app, you'd save this to the backend
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}