import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Todo } from '../models/todo.interface';
import { TodoRequest } from '../models/todo-request.interface';
import { PageResponse } from '../models/page-response.interface';
import { SectionResponse } from '../models/section-response.interface';
import { SectionRequest } from '../models/section-request.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private apiService: ApiService) {}

  // ========== TODO CRUD Operations ==========

  /**
   * Get all todos with pagination support
   * @param page - Page number (0-based)
   * @param size - Page size
   * @param sort - Sort criteria
   * @param array - If true, returns array instead of paginated response
   */
  getTodos(page: number = 0, size: number = 20, sort?: string, array: boolean = false): Observable<PageResponse<Todo> | Todo[]> {
    const params: any = { page, size };
    if (sort) params.sort = sort;
    if (array) params.array = 'true';
    return this.apiService.get<PageResponse<Todo> | Todo[]>('/todo', params).pipe(
      map(response => {
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        return response.data;
      }),
      catchError(error => this.handleError('Error fetching todos', error))
    );
  }

  /**
   * Get a single todo by ID
   * @param id - Todo ID
   */
  getTodoById(id: string): Observable<Todo> {
    if (!id || id.trim() === '') {
      return throwError(() => new Error('Todo ID is required'));
    }
    return this.apiService.get<Todo>(`/todo/${id}`).pipe(
      map(response => {
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        return response.data;
      }),
      catchError(error => this.handleError('Error fetching todo', error))
    );
  }

  /**
   * Create a new todo
   * @param todoRequest - Todo request object
   */
  createTodo(todoRequest: TodoRequest): Observable<Todo> {
    if (!todoRequest) {
      return throwError(() => new Error('Todo request is required'));
    }
    return this.apiService.post<Todo>('/todo', todoRequest).pipe(
      map(response => {
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        return response.data;
      }),
      catchError(error => this.handleError('Error creating todo', error))
    );
  }

  /**
   * Update an existing todo
   * @param id - Todo ID
   * @param todoRequest - Updated todo request object
   */
  updateTodo(id: string, todoRequest: TodoRequest): Observable<Todo> {
    if (!id || id.trim() === '') {
      return throwError(() => new Error('Todo ID is required'));
    }
    if (!todoRequest) {
      return throwError(() => new Error('Todo request is required'));
    }
    return this.apiService.put<Todo>(`/todo/${id}`, todoRequest).pipe(
      map(response => {
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        return response.data;
      }),
      catchError(error => this.handleError('Error updating todo', error))
    );
  }

  /**
   * Delete a todo by ID
   * @param id - Todo ID
   */
  deleteTodo(id: string): Observable<void> {
    if (!id || id.trim() === '') {
      return throwError(() => new Error('Todo ID is required'));
    }
    return this.apiService.delete<void>(`/todo/${id}`).pipe(
      map(() => {}),
      catchError(error => this.handleError('Error deleting todo', error))
    );
  }

  // ========== SECTION CRUD Operations ==========

  /**
   * Get all sections
   */
  getSections(): Observable<SectionResponse[]> {
    return this.apiService.get<SectionResponse[]>('/todo/sections').pipe(
      map(response => {
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        return Array.isArray(response.data) ? response.data : [];
      }),
      catchError(error => this.handleError('Error fetching sections', error))
    );
  }

  /**
   * Create a new section
   * @param sectionRequest - Section request object with name
   */
  addSection(sectionRequest: SectionRequest): Observable<SectionResponse> {
    if (!sectionRequest || !sectionRequest.name || sectionRequest.name.trim() === '') {
      return throwError(() => new Error('Section name is required'));
    }
    return this.apiService.post<SectionResponse>('/todo/sections', sectionRequest).pipe(
      map(response => {
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        return response.data;
      }),
      catchError(error => this.handleError('Error creating section', error))
    );
  }

  /**
   * Update an existing section
   * @param oldSectionName - Current section name
   * @param sectionRequest - Section request with new name
   */
  updateSection(oldSectionName: string, sectionRequest: SectionRequest): Observable<SectionResponse> {
    if (!oldSectionName || oldSectionName.trim() === '') {
      return throwError(() => new Error('Old section name is required'));
    }
    if (!sectionRequest || !sectionRequest.name || sectionRequest.name.trim() === '') {
      return throwError(() => new Error('New section name is required'));
    }
    return this.apiService.put<SectionResponse>(`/todo/sections/${oldSectionName}`, sectionRequest).pipe(
      map(response => {
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        return response.data;
      }),
      catchError(error => this.handleError('Error updating section', error))
    );
  }

  /**
   * Delete a section and all its todos
   * @param sectionName - Section name to delete
   */
  deleteSection(sectionName: string): Observable<void> {
    if (!sectionName || sectionName.trim() === '') {
      return throwError(() => new Error('Section name is required'));
    }
    return this.apiService.delete<void>(`/todo/sections/${sectionName}`).pipe(
      map(() => {}),
      catchError(error => this.handleError('Error deleting section', error))
    );
  }

  /**
   * Get todos for a specific section with pagination support
   * @param section - Section name
   * @param page - Page number (0-based)
   * @param size - Page size
   * @param sort - Sort criteria
   */
  getTodosBySection(section: string, page: number = 0, size: number = 20, sort?: string): Observable<PageResponse<Todo>> {
    if (!section || section.trim() === '') {
      return throwError(() => new Error('Section name is required'));
    }
    const params: any = { page, size };
    if (sort) params.sort = sort;
    return this.apiService.get<PageResponse<Todo>>(`/todo/section/${section}`, params).pipe(
      map(response => {
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        return response.data;
      }),
      catchError(error => this.handleError('Error fetching todos by section', error))
    );
  }

  /**
   * Handle API errors
   * @param message - Error message
   * @param error - Error object
   */
  private handleError(message: string, error: any): Observable<never> {
    let errorMessage = message;
    if (error && error.error && typeof error.error === 'object') {
      if (error.error.message) {
        errorMessage = `${message}: ${error.error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = `${message}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}