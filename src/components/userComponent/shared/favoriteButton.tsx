"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  eventId: string;
  eventTitle: string;
  /** "icon": round button over a poster. "pill": labelled button on the event page. */
  variant?: "icon" | "pill";
  className?: string;
}

export function FavoriteButton({ eventId, eventTitle, variant = "icon", className }: FavoriteButtonProps) {
  const { ids, isSaved, toggle } = useFavorites();
  const saved = isSaved(eventId);
  const label = saved ? `Remove ${eventTitle} from saved` : `Save ${eventTitle}`;
  const icon = <Heart aria-hidden="true" className={cn(saved && "fill-accent-pink text-accent-pink")} />;

  if (variant === "pill") {
    return (
      <Button
        variant="outline"
        hoverScale={1}
        aria-pressed={saved}
        aria-label={label}
        disabled={ids === null}
        onClick={() => toggle(eventId)}
        className={cn("h-11 rounded-full px-5", saved && "border-accent-pink", className)}
      >
        {icon}
        {saved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      hoverScale={1.08}
      aria-pressed={saved}
      aria-label={label}
      disabled={ids === null}
      onClick={() => toggle(eventId)}
      className={cn(
        "size-10 rounded-full bg-bg-base/75 text-text-primary backdrop-blur-sm hover:bg-bg-base/90 disabled:opacity-100",
        className,
      )}
    >
      {icon}
    </Button>
  );
}
