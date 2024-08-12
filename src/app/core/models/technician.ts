import { Account } from './account';
import { Ticket } from './ticket';

export interface Technician extends Account {
  // specialization: string;
  assignedTickets: Ticket[];
}