import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../../services/todo.service';
import { AuthService } from '../../../services/auth.service';
import { Todo } from '../../../models/todo.interface';
import { PageResponse } from '../../../models/page-response.interface';
import { Status } from '../../../models/status.enum';
import { Priority } from '../../../models/priority.enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
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