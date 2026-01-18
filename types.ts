import { LucideIcon } from 'lucide-react';

export interface Tab {
  id: string;
  type: ViewType;
  title: string;
  icon?: LucideIcon;
  data?: any; // For dynamic content like RO ID, Customer ID
  isClosable: boolean;
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  CRM = 'CRM',
  SALES = 'SALES',
  SERVICE = 'SERVICE',
  REPORTS = 'REPORTS',
  ADMIN = 'ADMIN',
  RO_DETAIL = 'RO_DETAIL',
  TECH_VIEW = 'TECH_VIEW',
  CUSTOMER_360 = 'CUSTOMER_360',   // The Search/List Dashboard
  CUSTOMER_DETAIL = 'CUSTOMER_DETAIL', // The Specific Profile (James Bond)
  CALENDAR = 'CALENDAR',
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  viewType: ViewType;
}

export type Theme = 'light' | 'dark';

export type UserRole = 'MANAGER' | 'SALES' | 'SERVICE' | 'TECHNICIAN';