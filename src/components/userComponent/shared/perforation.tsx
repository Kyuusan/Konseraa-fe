import { cn } from "@/lib/utils";

// The ticket "tear line": a dashed rule with a half-circle bite out of each edge.
// Place it as a direct child of a TicketCard; `inset` matches the card's horizontal padding.
export function Perforation({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative flex items-center", className)}>
      <span className="absolute left-0 size-5 -translate-x-1/2 rounded-full bg-bg-base" />
      <span className="mx-4 h-px flex-1 border-t border-dashed border-text-primary/15" />
      <span className="absolute right-0 size-5 translate-x-1/2 rounded-full bg-bg-base" />
    </div>
  );
}
