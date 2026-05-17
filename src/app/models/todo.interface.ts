import { Status } from './status.enum';
import { Priority } from './priority.enum';

export interface Todo {
  id: string;
  tenantId: string;
  topic: string;
  summaryPoints: string;
  status: Status;
  priority: Priority;
  section: string;
  createdAt: string;
  updatedAt: string;
}