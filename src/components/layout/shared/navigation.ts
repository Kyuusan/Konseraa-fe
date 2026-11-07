import {
  CalendarDays,
  ChartColumn,
  CirclePlus,
  Compass,
  FileText,
  House,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
  Wallet,
  Briefcase,
  CircleHelp,
  LogOut,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Only active on this exact path, not on its children. */
  exact?: boolean;
}

export function isActivePath(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export const USER_NAV: NavItem[] = [
  { label: "Home", href: "/home", icon: House },
  { label: "Explore", href: "/events", icon: Compass },
  { label: "Tickets", href: "/tickets", icon: Ticket },
  { label: "Organizer", href: "/organizer", icon: Briefcase },
];

export const ORGANIZER_NAV: NavItem[] = [
  { label: "Overview", href: "/organizer", icon: LayoutDashboard, exact: true },
  { label: "My events", href: "/organizer/events", icon: CalendarDays },
  { label: "Create event", href: "/organizer/events/new", icon: CirclePlus },
  { label: "Analytics", href: "/organizer/analytics", icon: ChartColumn },
  { label: "Payouts", href: "/organizer/payouts", icon: Wallet },
  { label: "Another page", href: "/organizer/another-page", icon: FileText },
  { label: "Settings", href: "/organizer/settings", icon: Settings },
];

// Bottom group of each rail: help and log out.
export const ORGANIZER_FOOTER_NAV: NavItem[] = [
  { label: "Help", href: "/organizer/help", icon: CircleHelp },
  { label: "Log out", href: "/login", icon: LogOut },
];

export const ADMIN_FOOTER_NAV: NavItem[] = [
  { label: "Help", href: "/admin/help", icon: CircleHelp },
  { label: "Log out", href: "/admin/login", icon: LogOut },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Transactions", href: "/admin/transactions", icon: Receipt },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
