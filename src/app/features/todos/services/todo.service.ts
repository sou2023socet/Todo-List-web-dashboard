import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { Todo } from '../../../models/todo.interface';
import { TodoRequest } from '../../../models/todo-request.interface';
import { PageResponse } from '../../../models/page-response.interface';
import { SectionResponse } from '../../../models/section-response.interface';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private base = '/todo';

  constructor(private api: ApiService) {}

  list(page = 0, size = 20, array = false): Observable<PageResponse<Todo> | Todo[]> {
    const q = `?page=${page}&size=${size}&array=${array}`;
    return this.api.get<any>(`${this.base}${q}`);
  }

  getById(id: string): Observable<Todo> {
    return this.api.get<Todo>(`${this.base}/${id}`);
  }

  create(request: TodoRequest): Observable<Todo> {
    return this.api.post<Todo>(`${this.base}`, request);
  }

  update(id: string, request: TodoRequest): Observable<Todo> {
    return this.api.put<Todo>(`${this.base}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }

  listSections(): Observable<SectionResponse[]> {
    return this.api.get<SectionResponse[]>(`${this.base}/sections`);
  }

  createSection(name: string) {
    return this.api.post<SectionResponse>(`${this.base}/sections`, { name });
  }

  updateSection(oldName: string, newName: string) {
    return this.api.put<SectionResponse>(`${this.base}/sections/${encodeURIComponent(oldName)}`, { name: newName });
  }

  deleteSection(name: string) {
    return this.api.delete<void>(`${this.base}/sections/${encodeURIComponent(name)}`);
  }

  listBySection(section: string, page = 0, size = 20, array = false) {
    const q = `?page=${page}&size=${size}&array=${array}`;
    return this.api.get<any>(`${this.base}/section/${encodeURIComponent(section)}${q}`);
  }
}
