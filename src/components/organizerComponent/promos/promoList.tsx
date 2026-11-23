"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import type { Promo } from "@/types/promo";
import { PROMO_FILTERS } from "./promoFormat";
import { PromoTable } from "./promoTable";

interface PromoListProps {
  promos: Promo[];
  eventTitles: Record<string, string>;
}

// Turning a code on/off and deleting stand in for API calls: changes last until reload.
export function PromoList({ promos: initialPromos, eventTitles }: PromoListProps) {
  const [promos, setPromos] = useState(initialPromos);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(promo: Promo) {
    void navigator.clipboard?.writeText(promo.code);
    setCopiedId(promo.id);
    setTimeout(() => setCopiedId((current) => (current === promo.id ? null : current)), 2000);
  }

  function handleToggle(promo: Promo) {
    const turningOn = !promo.is_active;
    const status = turningOn ? (Date.parse(promo.starts_at) > Date.now() ? "scheduled" : "active") : "inactive";
    setPromos((current) => current.map((item) => (item.id === promo.id ? { ...item, is_active: turningOn, status } : item)));
  }

  const groups = PROMO_FILTERS.map((filter) => ({
    ...filter,
    promos: filter.statuses === null ? promos : promos.filter((promo) => filter.statuses.some((status) => status === promo.status)),
  }));

  const tableProps = {
    eventTitles,
    copiedId,
    onCopy: handleCopy,
    onToggle: handleToggle,
    onDelete: (promo: Promo) => setPromos((current) => current.filter((item) => item.id !== promo.id)),
  };

  return (
    <Tabs defaultValue="all" className="gap-6">
      <div className="-mx-3 overflow-x-auto px-3 scrollbar-none sm:mx-0 sm:px-0">
        <TabsList className="h-11 w-max rounded-full bg-bg-surface p-1">
          {groups.map((group) => (
            <TabsTrigger key={group.value} value={group.value} className="rounded-full px-4">
              {group.label} ({group.promos.length})
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContents>
        {groups.map((group) => (
          <TabsContent key={group.value} value={group.value}>
            <PromoTable promos={group.promos} {...tableProps} />
          </TabsContent>
        ))}
      </TabsContents>
    </Tabs>
  );
}
