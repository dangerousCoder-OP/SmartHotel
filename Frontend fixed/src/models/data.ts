export type Role = 'admin' | 'manager' | 'user';

export type User = {
  email: string;
  password: string;
  role: Role;
  name: string;
};

// In-memory mock users
export const users: User[] = [
  { email: 'admin@hotel.com', password: 'admin123', role: 'admin', name: 'Admin' },
  { email: 'manager@hotel.com', password: 'manager123', role: 'manager', name: 'Manager' },
  { email: 'user@hotel.com', password: 'user123', role: 'user', name: 'User' },
];