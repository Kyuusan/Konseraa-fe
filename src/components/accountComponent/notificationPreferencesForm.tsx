"use client";

import { useState } from "react";
import { Switch } from "@/components/animate-ui/components/radix/switch";
import { Label } from "@/components/ui/label";
import type { NotificationPreferences } from "@/types/notification";

const CHANNELS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: "notify_push", label: "Push notifications", description: "On this device, for anything that needs you right away." },
  { key: "notify_email", label: "Email", description: "Confirmations, receipts and reminders." },
  { key: "notify_sms", label: "SMS", description: "Sign-in codes and payment reminders." },
];

// Each switch stands in for PUT /users/me/preferences (in spec) and applies at once.
export function NotificationPreferencesForm({ initial }: { initial: NotificationPreferences }) {
  const [values, setValues] = useState(initial);

  return (
    <ul className="divide-y divide-text-primary/10">
      {CHANNELS.map((channel) => (
        <li key={channel.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
          <div className="space-y-0.5">
            <Label htmlFor={channel.key} className="text-sm font-semibold">
              {channel.label}
            </Label>
            <p className="text-sm text-text-primary/70">{channel.description}</p>
          </div>
          <Switch
            id={channel.key}
            checked={values[channel.key]}
            onCheckedChange={(checked) => setValues((current) => ({ ...current, [channel.key]: checked }))}
          />
        </li>
      ))}
    </ul>
  );
}
