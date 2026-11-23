"use client";

import { useRouter } from "next/navigation";
import { DEMO_ORGANIZER_STATES, DEMO_STATE_COOKIE, type DemoOrganizerState, writeDemoCookie } from "@/__fixtures__/demoState";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LABELS: Record<DemoOrganizerState, string> = {
  none: "Not registered",
  pending: "Pending",
  in_review: "In review",
  rejected: "Rejected",
  approved: "Approved",
};

// Development-only: there is no admin review yet, so this flips the organizer state.
export function DemoStateSwitcher({ state }: { state: DemoOrganizerState }) {
  const router = useRouter();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-warning/50 px-4 py-3 text-sm">
      <Label htmlFor="demo-organizer-state" className="font-semibold text-warning">
        Demo organizer state
      </Label>
      <Select
        value={state}
        onValueChange={(value) => {
          writeDemoCookie(DEMO_STATE_COOKIE, value);
          router.refresh();
        }}
      >
        <SelectTrigger id="demo-organizer-state" size="sm" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DEMO_ORGANIZER_STATES.map((item) => (
            <SelectItem key={item} value={item}>{LABELS[item]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-text-muted">Development only, stands in for the admin review.</span>
    </div>
  );
}
