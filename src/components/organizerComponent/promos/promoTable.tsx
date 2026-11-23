"use client";

import { Copy, Ellipsis, Power, Trash2 } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { Progress } from "@/components/animate-ui/components/radix/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatNumber } from "@/lib/format";
import type { Promo } from "@/types/promo";
import { formatDiscount, formatValidity } from "./promoFormat";

interface PromoTableProps {
  promos: Promo[];
  eventTitles: Record<string, string>;
  copiedId: string | null;
  onCopy: (promo: Promo) => void;
  onToggle: (promo: Promo) => void;
  onDelete: (promo: Promo) => void;
}

/** Ended codes can no longer be switched; used codes are kept for the booking history. */
const canToggle = (promo: Promo) => ["active", "scheduled", "inactive"].includes(promo.status);

export function PromoTable({ promos, eventTitles, copiedId, onCopy, onToggle, onDelete }: PromoTableProps) {
  if (promos.length === 0) {
    return <EmptyState title="No promo codes here" description="Codes with this status will show up in this list." />;
  }

  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Applies to</TableHead>
            <TableHead>Used</TableHead>
            <TableHead>Valid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-px">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promos.map((promo) => {
            const percent = Math.round((promo.used_count / promo.usage_limit) * 100);
            return (
              <TableRow key={promo.id}>
                <TableCell>
                  <p className="font-mono font-semibold tracking-wider">{promo.code}</p>
                  <p role="status" className="text-xs text-accent-lime">
                    {copiedId === promo.id && "Copied"}
                  </p>
                </TableCell>
                <TableCell className="font-semibold whitespace-nowrap">{formatDiscount(promo)}</TableCell>
                <TableCell className="max-w-48 truncate text-text-primary/70">
                  {promo.event_id ? eventTitles[promo.event_id] : "All my events"}
                </TableCell>
                <TableCell>
                  <div className="w-36 space-y-1.5">
                    <p className="text-xs">
                      <span className="font-semibold">{formatNumber(promo.used_count)}</span>
                      <span className="text-text-primary/70"> / {formatNumber(promo.usage_limit)}</span>
                    </p>
                    <Progress value={percent} aria-label={`${percent}% of the limit used`} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-text-primary/70">{formatValidity(promo)}</TableCell>
                <TableCell>
                  <StatusBadge status={promo.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" hoverScale={1} aria-label={`Actions for ${promo.code}`} className="rounded-full">
                        <Ellipsis aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-44 rounded-2xl p-1.5">
                      <DropdownMenuItem onSelect={() => onCopy(promo)}>
                        <Copy aria-hidden="true" />
                        Copy code
                      </DropdownMenuItem>
                      {canToggle(promo) && (
                        <DropdownMenuItem onSelect={() => onToggle(promo)}>
                          <Power aria-hidden="true" />
                          {promo.is_active ? "Turn off" : "Turn on"}
                        </DropdownMenuItem>
                      )}
                      {promo.used_count === 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(promo)}>
                            <Trash2 aria-hidden="true" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
