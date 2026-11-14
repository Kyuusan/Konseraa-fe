import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// The one ticket-shaped card: 20px radius with the torn top-right notch (design.md §2).
export function TicketCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("ticket-notch relative overflow-hidden rounded-[20px] bg-bg-surface", className)}
      {...props}
    />
  );
}
