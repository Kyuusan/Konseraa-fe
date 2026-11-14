"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";

interface EventTabsProps {
  description: string;
  lineup: ReactNode;
  reviews: ReactNode;
}

// Q&A (PRD §13.2) is left out until the forum has a schema and endpoint.
export function EventTabs({ description, lineup, reviews }: EventTabsProps) {
  return (
    <Tabs defaultValue="description" className="gap-6">
      <TabsList className="h-11 w-full rounded-full bg-bg-surface p-1 sm:w-fit">
        <TabsTrigger value="description" className="rounded-full px-5">Description</TabsTrigger>
        <TabsTrigger value="lineup" className="rounded-full px-5">Line-up</TabsTrigger>
        <TabsTrigger value="reviews" className="rounded-full px-5">Reviews</TabsTrigger>
      </TabsList>
      <TabsContents>
        <TabsContent value="description">
          <p className="max-w-2xl leading-relaxed text-text-primary/90">{description}</p>
        </TabsContent>
        <TabsContent value="lineup">{lineup}</TabsContent>
        <TabsContent value="reviews">{reviews}</TabsContent>
      </TabsContents>
    </Tabs>
  );
}
