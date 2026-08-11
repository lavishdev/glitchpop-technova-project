export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
  category?: 'main' | 'operations' | 'management' | 'system';
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}
