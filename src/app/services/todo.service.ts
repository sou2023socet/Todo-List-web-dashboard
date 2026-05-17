import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Todo } from '../models/todo.interface';
import { TodoRequest } from '../models/todo-request.interface';
import { PageResponse } from '../models/page-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private apiService: ApiService) {}

  getTodos(page: number = 0, size: number = 20, sort?: string, array: boolean = false): Observable<PageResponse<Todo> | Todo[]> {
    const params: any = { page, size };
    if (sort) params.sort = sort;
    if (array) params.array = 'true';
    return this.apiService.get<PageResponse<Todo> | Todo[]>('/todo', params).pipe(
      map(response => response.data!)
    );
  }

  getTodoById(id: string): Observable<Todo> {
    return this.apiService.get<Todo>(`/todo/${id}`).pipe(
      map(response => response.data!)
    );
  }

  createTodo(todoRequest: TodoRequest): Observable<Todo> {
    return this.apiService.post<Todo>('/todo', todoRequest).pipe(
      map(response => response.data!)
    );
  }

  updateTodo(id: string, todoRequest: TodoRequest): Observable<Todo> {
    return this.apiService.put<Todo>(`/todo/${id}`, todoRequest).pipe(
      map(response => response.data!)
    );
  }

  deleteTodo(id: string): Observable<void> {
    return this.apiService.delete<void>(`/todo/${id}`).pipe(
      map(() => {})
    );
  }

  getSections(): Observable<string[]> {
    return this.apiService.get<string[]>('/todo/sections').pipe(
      map(response => response.data!)
    );
  }

  getTodosBySection(section: string, page: number = 0, size: number = 20, sort?: string): Observable<PageResponse<Todo>> {
    const params: any = { page, size };
    if (sort) params.sort = sort;
    return this.apiService.get<PageResponse<Todo>>(`/todo/section/${section}`, params).pipe(
      map(response => response.data!)
    );
  }
}