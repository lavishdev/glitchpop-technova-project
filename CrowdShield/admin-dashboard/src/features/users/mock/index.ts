import { UserAccount } from '../types';

export const MOCK_USERS: UserAccount[] = [
  {
    id: "USR-001",
    name: "Alex Sterling",
    email: "asterling@crowdshield.com",
    role: "Super Admin",
    department: "Executive",
    status: "active",
    lastActive: "Just now",
  },
  {
    id: "USR-002",
    name: "Capt. Marcus Vance",
    email: "mvance@crowdshield.com",
    role: "Security Officer",
    department: "Field Ops",
    status: "active",
    lastActive: "5 mins ago",
  },
  {
    id: "USR-003",
    name: "Dr. Elena Rostova",
    email: "erostova@crowdshield.com",
    role: "Data Auditor",
    department: "Analytics",
    status: "inactive",
    lastActive: "2 days ago",
  },
  {
    id: "USR-004",
    name: "Officer Sarah Chen",
    email: "schen@crowdshield.com",
    role: "Field Dispatcher",
    department: "Response",
    status: "active",
    lastActive: "15 mins ago",
  },
];
