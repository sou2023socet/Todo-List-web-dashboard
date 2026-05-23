import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../../../../models/todo.interface';
import { Status } from '../../../../models/status.enum';
import { Priority } from '../../../../models/priority.enum';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700" for="topic">Topic</label>
        <input id="topic" formControlName="topic" class="mt-1 block w-full border rounded-md px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700" for="summaryPoints">Summary</label>
        <textarea id="summaryPoints" formControlName="summaryPoints" rows="3" class="mt-1 block w-full border rounded-md px-3 py-2"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700" for="section">Section</label>
        <select id="section" formControlName="section" class="mt-1 block w-full border rounded-md px-3 py-2">
          <option *ngFor="let section of sections" [value]="section">{{ section }}</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="status">Status</label>
          <select id="status" formControlName="status" class="mt-1 block w-full border rounded-md px-3 py-2">
            <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700" for="priority">Priority</label>
          <select id="priority" formControlName="priority" class="mt-1 block w-full border rounded-md px-3 py-2">
            <option *ngFor="let priority of priorityOptions" [value]="priority">{{ priority }}</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <button type="button" (click)="cancel.emit()" class="px-4 py-2 border rounded-md">Cancel</button>
        <button type="submit" [disabled]="form.invalid" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Save</button>
      </div>
    </form>
  `
})
export class TodoFormComponent implements OnChanges {
  @Input() todo: Todo | null = null;
  @Input() sections: string[] = [];
  @Output() save = new EventEmitter<Todo>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  statusOptions = Object.values(Status);
  priorityOptions = Object.values(Priority);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      topic: ['', Validators.required],
      summaryPoints: ['', Validators.required],
      section: ['', Validators.required],
      status: [Status.PENDING, Validators.required],
      priority: [Priority.MEDIUM, Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo']) {
      if (this.todo) {
        this.form.patchValue({
          topic: this.todo.topic,
          summaryPoints: this.todo.summaryPoints,
          section: this.todo.section,
          status: this.todo.status,
          priority: this.todo.priority
        });
      } else {
        this.form.reset({
          topic: '',
          summaryPoints: '',
          section: this.sections.length ? this.sections[0] : '',
          status: Status.PENDING,
          priority: Priority.MEDIUM
        });
      }
    }
  }

  submit(): void {
    if (!this.form.valid) return;
    this.save.emit({
      ...this.todo,
      ...this.form.value
    } as Todo);
  }
}
