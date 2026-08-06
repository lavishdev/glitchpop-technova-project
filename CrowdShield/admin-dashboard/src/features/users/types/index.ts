export type UserRole = 'Super Admin' | 'Security Officer' | 'Data Auditor' | 'Field Dispatcher';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive';
  lastActive: string;
  avatarUrl?: string;
}
