"use client";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GateSession } from "./gateSessions";

interface SessionPickerProps {
  sessions: GateSession[];
  value: string;
  /** Page the choice applies to, e.g. "/gate" or "/gate/stats". */
  basePath: string;
}

export function SessionPicker({ sessions, value, basePath }: SessionPickerProps) {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <Label htmlFor="gate-session" className="text-sm font-medium">
        Session you are working
      </Label>
      <Select value={value} onValueChange={(id) => router.replace(`${basePath}?session=${id}`)}>
        <SelectTrigger id="gate-session" className="h-12! w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent data-lenis-prevent>
          {sessions.map((session) => (
            <SelectItem key={session.id} value={session.id}>
              {session.event_title} · {session.session_name} · {session.when}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
