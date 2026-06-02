
export enum UserCategory {
  ALL_USERS = 'All Users',
  FUTURES_USERS = 'Futures Users',
  NON_FUTURES_USERS = 'Non-Futures Users',
  INACTIVE_FUTURES = 'Funds in Futures (Inactive)',
  ACTIVE_TRADERS = 'Active Traders',
  LEARNERS = 'Learners / Beginners'
}

export interface NotificationItem {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  category: UserCategory;
  title: string;
  body: string;
}

export interface GenerateParams {
  date: string;
  category: UserCategory;
  count: number;
  tone: string;
  topic: string;
  occasion?: string;
}
