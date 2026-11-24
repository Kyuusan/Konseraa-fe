import {
  CalendarDays,
  ChartColumn,
  Compass,
  House,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Ticket,
  Users,
  Wallet,
  Briefcase,
  ScanLine,
  TicketPercent,
  CircleHelp,
  LogOut,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Only active on this exact path, not on its children. */
  exact?: boolean;
  /** Other sections that belong to this item (e.g. /orders under Tickets). */
  also?: string[];
}

const matches = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function isActivePath(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return [item.href, ...(item.also ?? [])].some((href) => matches(pathname, href));
}

export const USER_NAV: NavItem[] = [
  { label: "Home", href: "/home", icon: House },
  { label: "Explore", href: "/events", icon: Compass, also: ["/saved"] },
  { label: "Tickets", href: "/tickets", icon: Ticket, also: ["/orders"] },
  { label: "Organizer", href: "/organizer", icon: Briefcase },
];

export const ORGANIZER_NAV: NavItem[] = [
  { label: "Overview", href: "/organizer", icon: LayoutDashboard, exact: true },
  { label: "My events", href: "/organizer/events", icon: CalendarDays },
  { label: "Promo codes", href: "/organizer/promos", icon: TicketPercent },
  { label: "Refunds", href: "/organizer/refunds", icon: RotateCcw },
  { label: "Gatekeepers", href: "/organizer/gatekeepers", icon: ScanLine },
  { label: "Analytics", href: "/organizer/analytics", icon: ChartColumn },
  { label: "Payouts", href: "/organizer/payouts", icon: Wallet },
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
];
