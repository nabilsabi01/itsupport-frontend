import { Account } from './account';
import { Ticket } from './ticket';
import { Equipment } from './equipment';

export interface User extends Account {
  tickets: Ticket[];
  assignedEquipment: Equipment[];
}