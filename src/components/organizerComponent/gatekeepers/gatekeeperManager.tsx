"use client";

import { Ellipsis, KeyRound, Power, Trash2 } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime } from "@/lib/format";
import type { Gatekeeper } from "@/types/gatekeeper";
import { AddGatekeeperDialog } from "./addGatekeeperDialog";
import { CredentialsCard, generatePassword } from "./credentialsCard";

const TIME_ZONE = "Asia/Jakarta";

interface GatekeeperManagerProps {
  organizerId: string;
  gatekeepers: Gatekeeper[];
  /** Events new gatekeepers can be assigned to. */
  assignableEvents: { id: string; title: string }[];
  eventTitles: Record<string, string>;
}

// Changes stand in for API calls and last until reload.
export function GatekeeperManager({ organizerId, gatekeepers: initial, assignableEvents, eventTitles }: GatekeeperManagerProps) {
  const [gatekeepers, setGatekeepers] = useState(initial);
  const [reset, setReset] = useState<{ name: string; email: string; password: string } | null>(null);

  const update = (id: string, patch: Partial<Gatekeeper>) =>
    setGatekeepers((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-primary/70">
          {gatekeepers.filter((item) => item.status === "active").length} active of {gatekeepers.length} accounts
        </p>
        <AddGatekeeperDialog
          organizerId={organizerId}
          events={assignableEvents}
          takenEmails={gatekeepers.map((item) => item.email.toLowerCase())}
          onCreate={(gatekeeper) => setGatekeepers((current) => [gatekeeper, ...current])}
        />
      </div>

      {gatekeepers.length === 0 ? (
        <EmptyState title="No gatekeepers yet" description="Add the people who will scan tickets at your venue gates." />
      ) : (
        <div className="overflow-hidden rounded-[20px] bg-bg-surface">
          <Table className="min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead>Gatekeeper</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-px">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gatekeepers.map((gatekeeper) => (
                <TableRow key={gatekeeper.id}>
                  <TableCell>
                    <p className="font-semibold">{gatekeeper.full_name}</p>
                    <p className="text-xs text-text-primary/70">{gatekeeper.email}</p>
                  </TableCell>
                  <TableCell className="max-w-72 whitespace-normal text-text-primary/80">
                    {gatekeeper.event_ids.map((id) => eventTitles[id] ?? "Removed event").join(", ")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/70">
                    {gatekeeper.last_active_at ? formatDateTime(gatekeeper.last_active_at, TIME_ZONE) : "Never signed in"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={gatekeeper.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          hoverScale={1}
                          aria-label={`Actions for ${gatekeeper.full_name}`}
                          className="rounded-full"
                        >
                          <Ellipsis aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-48 rounded-2xl p-1.5">
                        <DropdownMenuItem
                          onSelect={() =>
                            setReset({ name: gatekeeper.full_name, email: gatekeeper.email, password: generatePassword() })
                          }
                        >
                          <KeyRound aria-hidden="true" />
                          Reset password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => update(gatekeeper.id, { status: gatekeeper.status === "active" ? "disabled" : "active" })}
                        >
                          <Power aria-hidden="true" />
                          {gatekeeper.status === "active" ? "Turn off account" : "Turn on account"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setGatekeepers((current) => current.filter((item) => item.id !== gatekeeper.id))}
                        >
                          <Trash2 aria-hidden="true" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={reset !== null} onOpenChange={(open) => !open && setReset(null)}>
        <DialogContent className="gap-5 rounded-[20px] border-text-primary/10 bg-bg-surface p-6 sm:max-w-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="font-heading text-2xl">New password</DialogTitle>
            <DialogDescription className="text-text-primary/70">
              The old password stops working and {reset?.name} is signed out on every device.
            </DialogDescription>
          </DialogHeader>
          {reset && <CredentialsCard {...reset} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
