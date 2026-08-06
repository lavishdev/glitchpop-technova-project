export type UserRole = 'ADMIN' | 'USER' | 'OPERATOR';

export interface UserAccount {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
