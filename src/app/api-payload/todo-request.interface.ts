import { Status } from '../models/status.enum';
import { Priority } from '../models/priority.enum';

export interface TodoRequest {
  topic: string;
  summaryPoints: string;
  status: Status;
  priority: Priority;
  section: string;
}
