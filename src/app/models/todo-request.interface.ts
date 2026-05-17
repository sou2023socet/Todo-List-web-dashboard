import { Status } from './status.enum';
import { Priority } from './priority.enum';

export interface TodoRequest {
  topic: string;
  summaryPoints: string;
  status: Status;
  priority: Priority;
  section: string;
}