export interface Group {
  id: string;
  name: string;
  target: number;
  current: number;
  totalDonations: number;
  createdAt: Date;
}

export interface Donator {
  id: string;
  name: string;
  amount: number;
  groupId: string;
  groupName: string;
  notes?: string;
  createdAt: Date;
}

export interface Donation {
  id: string;
  donatorName: string;
  amount: number;
  groupId: string;
  groupName: string;
  notes?: string;
  createdAt: Date;
}

export interface Target {
  id: string;
  groupId: string;
  amount: number;
  description?: string;
  createdAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
}