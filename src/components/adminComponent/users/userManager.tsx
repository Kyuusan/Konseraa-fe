"use client";

import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { OptionSelect } from "@/components/organizerComponent/shared/optionSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime } from "@/lib/format";
import type { AdminUser } from "@/types/admin";
import type { UserRole } from "@/types/user";
import { ADMIN_TIME_ZONE } from "../dashboard/reviewQueueCard";

/** limit of GET /admin/users (spec default 10). */
const PAGE_SIZE = 10;

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending_verification", label: "Unverified" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
] as const;

const ROLE_FILTERS: { value: string; label: string; roles: UserRole[] | null }[] = [
  { value: "all", label: "All roles", roles: null },
  { value: "customer", label: "Fans", roles: ["customer"] },
  { value: "organizer", label: "Organizers", roles: ["organizer"] },
  { value: "gatekeeper", label: "Gatekeepers", roles: ["gatekeeper"] },
  { value: "admin", label: "Admins", roles: ["super_admin", "admin_event"] },
];

const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Fan",
  organizer: "Organizer",
  gatekeeper: "Gatekeeper",
  admin_event: "Event admin",
  super_admin: "Super admin",
};

type Status = AdminUser["status"];
type Action = { label: string; to: Status; confirm?: { title: string; body: string } };

// What each status can move to (PUT /admin/users/{id}/status). Suspending and banning ask first.
const ACTIONS: Record<Status, Action[]> = {
  active: [
    { label: "Suspend", to: "suspended", confirm: { title: "Suspend", body: "They can't sign in or buy tickets until you reactivate them. Tickets they hold stay valid." } },
    { label: "Ban", to: "banned", confirm: { title: "Ban", body: "They are signed out everywhere and can't come back with this account. Use this for fraud or abuse." } },
  ],
  pending_verification: [
    { label: "Mark as verified", to: "active" },
    { label: "Ban", to: "banned", confirm: { title: "Ban", body: "The account is blocked before it is ever used." } },
  ],
  suspended: [
    { label: "Reactivate", to: "active" },
    { label: "Ban", to: "banned", confirm: { title: "Ban", body: "They are signed out everywhere and can't come back with this account." } },
  ],
  banned: [{ label: "Lift ban", to: "active", confirm: { title: "Lift the ban on", body: "They can sign in and buy tickets again." } }],
};

const when = (iso: string | null) =>
  iso ? formatDateTime(iso, ADMIN_TIME_ZONE, { day: "numeric", month: "short", year: "numeric" }) : "Never";

export function UserManager({ users: initial }: { users: AdminUser[] }) {
  const [users, setUsers] = useState(initial);
  const [status, setStatus] = useState<string>("all");
  const [role, setRole] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<{ user: AdminUser; action: Action } | null>(null);

  const roleFilter = ROLE_FILTERS.find((item) => item.value === role)?.roles ?? null;
  const query = search.trim().toLowerCase();
  const matchesOthers = (user: AdminUser) =>
    (roleFilter === null || user.roles.some((item) => roleFilter.includes(item))) &&
    (query === "" || [user.full_name, user.email].some((text) => text.toLowerCase().includes(query)));
  const filtered = users.filter((user) => matchesOthers(user) && (status === "all" || user.status === status));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // Stands in for PUT /admin/users/{id}/status; lasts until reload.
  const apply = (user: AdminUser, to: Status) =>
    setUsers((list) => list.map((item) => (item.id === user.id ? { ...item, status: to } : item)));

  function choose(user: AdminUser, action: Action) {
    if (action.confirm) setPending({ user, action });
    else apply(user, action.to);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-[20px] bg-bg-surface p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="user-role" className="text-xs font-semibold">Role</Label>
          <OptionSelect
            id="user-role"
            value={role}
            options={ROLE_FILTERS.map(({ value, label }) => ({ value, label }))}
            onChange={(value) => {
              setRole(value);
              setPage(1);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="user-search" className="text-xs font-semibold">Search</Label>
          <Input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name or email"
            className="h-11"
          />
        </div>
      </div>

      <Tabs
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      >
        <div className="-mx-3 overflow-x-auto px-3 scrollbar-none sm:mx-0 sm:px-0">
          <TabsList className="h-11 w-max rounded-full bg-bg-surface p-1">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-full px-4">
                {tab.label} ({users.filter((user) => matchesOthers(user) && (tab.value === "all" || user.status === tab.value)).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {shown.length === 0 ? (
        <EmptyState title="No users found" description="Try another status, role or search." />
      ) : (
        <div className="overflow-hidden rounded-[20px] bg-bg-surface">
          <Table className="min-w-220">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last sign-in</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-px">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-xs text-text-primary/70">{user.email}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((item) => (
                        <span key={item} className="rounded-full bg-bg-surface-2 px-2 py-0.5 text-xs font-medium">
                          {ROLE_LABELS[item]}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-text-primary/80">{user.city ?? "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/70">{when(user.created_at)}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/70">{when(user.last_login_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    {/* Admin accounts are managed elsewhere, not from this list. */}
                    {!user.roles.includes("super_admin") && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" hoverScale={1} aria-label={`Actions for ${user.full_name}`} className="rounded-full">
                            <Ellipsis aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-44 rounded-2xl p-1.5">
                          {ACTIONS[user.status].map((action) => (
                            <DropdownMenuItem
                              key={action.label}
                              variant={action.to === "banned" ? "destructive" : "default"}
                              onSelect={() => choose(user, action)}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-primary/70">
        <span>
          {filtered.length} {filtered.length === 1 ? "user" : "users"} · page {current} of {pages}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" hoverScale={1} disabled={current === 1} onClick={() => setPage(current - 1)} className="rounded-full">
            <ChevronLeft aria-hidden="true" />
            Previous
          </Button>
          <Button variant="outline" size="sm" hoverScale={1} disabled={current === pages} onClick={() => setPage(current + 1)} className="rounded-full">
            Next
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Dialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent className="gap-5 rounded-[20px] border-text-primary/10 bg-bg-surface p-6 sm:max-w-md">
          {pending?.action.confirm && (
            <>
              <DialogHeader className="text-left">
                <DialogTitle className="font-heading text-2xl">
                  {pending.action.confirm.title} {pending.user.full_name}?
                </DialogTitle>
                <DialogDescription className="text-text-primary/70">{pending.action.confirm.body}</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" hoverScale={1} onClick={() => setPending(null)} className="rounded-full">
                  Cancel
                </Button>
                <Button
                  hoverScale={1}
                  onClick={() => {
                    apply(pending.user, pending.action.to);
                    setPending(null);
                  }}
                  className={
                    pending.action.to === "banned"
                      ? "rounded-full bg-danger font-semibold text-bg-base hover:bg-danger/90"
                      : "rounded-full font-semibold"
                  }
                >
                  {pending.action.label}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
