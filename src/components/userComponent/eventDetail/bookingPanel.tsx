"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatPrice, formatTime } from "@/lib/format";
import type { ConcertEvent, EventSession } from "@/types/event";

interface BookingPanelProps {
  event: ConcertEvent;
  sessions: EventSession[];
}

export function BookingPanel({ event, sessions }: BookingPanelProps) {
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");
  const onSale = event.status === "published" && sessionId !== "";
  const single = sessions.length === 1 ? sessions[0] : undefined;
  const timeZone = event.venue.timezone;

  return (
    <div className="space-y-5 rounded-[20px] bg-bg-surface p-5">
      <div>
        <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">Tickets from</p>
        <p className="font-heading text-3xl font-bold">{formatPrice(event.min_price)}</p>
      </div>

      {single ? (
        <p className="text-sm">
          <span className="font-semibold">{single.name}</span>
          <span className="block text-text-muted">
            {formatDate(single.start_at, timeZone)} · {formatTime(single.start_at, timeZone)}
          </span>
        </p>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="session" className="text-xs font-semibold tracking-widest text-text-muted uppercase">
            Session
          </Label>
          <Select value={sessionId} onValueChange={setSessionId}>
            <SelectTrigger id="session" className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {session.name} · {formatDate(session.start_at, timeZone)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {onSale ? (
        <Button asChild hoverScale={1.02} className="h-12 w-full rounded-full text-base font-semibold">
          <Link href={`/events/${event.slug}/tickets?session=${sessionId}`}>Choose tickets</Link>
        </Button>
      ) : (
        <Button disabled className="h-12 w-full rounded-full text-base font-semibold">
          Ticket sales have ended
        </Button>
      )}
    </div>
  );
}
