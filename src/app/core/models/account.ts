export interface Account {
    id?: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'TECHNICIAN';
    password?: string;
  }