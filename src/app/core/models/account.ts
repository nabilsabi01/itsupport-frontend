import { Role } from "../enums/role";

export interface Account {
  id?: number;
  name: string;
  email: string;
  role: Role;
  password?: string;
}

