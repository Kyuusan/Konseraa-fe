"use client";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventPickerProps {
  events: { slug: string; title: string }[];
  value: string;
}

export function EventPicker({ events, value }: EventPickerProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="analytics-event" className="text-sm font-medium">
        Event
      </Label>
      <Select value={value} onValueChange={(slug) => router.replace(`/organizer/analytics?event=${slug}`)}>
        <SelectTrigger id="analytics-event" className="h-11! w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent data-lenis-prevent>
          {events.map((event) => (
            <SelectItem key={event.slug} value={event.slug}>
              {event.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
