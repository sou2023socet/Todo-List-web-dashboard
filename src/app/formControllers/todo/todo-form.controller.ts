import { TodoRequest } from '../../models/todo-request.interface';

export class TodoFormController {
  form: TodoRequest;

  constructor() {
    this.form = { topic: '', summaryPoints: '', status: null as any, priority: null as any, section: '' };
  }

  validate() {
    return !!this.form.topic && !!this.form.summaryPoints && !!this.form.section;
  }

  getPayload(): TodoRequest {
    return this.form;
  }
}
