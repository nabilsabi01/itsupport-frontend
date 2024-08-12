import { Priority } from "../enums/priority";
import { TicketStatus } from "../enums/ticket-status";
import { Technician } from "./technician";
import { User } from "./user";


export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  assignedTechnician?: Technician;
}