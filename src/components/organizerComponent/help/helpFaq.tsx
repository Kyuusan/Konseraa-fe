"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/animate-ui/components/radix/accordion";
import { GATE_CLOSES_HOURS_AFTER, GATE_OPENS_HOURS_BEFORE, MAX_TICKETS_PER_TRANSACTION } from "@/lib/constants";

// Answers follow the rules agreed for the organizer flow and PRD §9.
const TOPICS = [
  {
    id: "verification",
    title: "Verification",
    questions: [
      {
        q: "What do I need to become an organizer?",
        a: "An organizer name and whether you are an individual or a company, plus a photo of your KTP. The organizer is tied to your account, so your account name, email and phone are used for the person in charge. Companies can add an NIB or deed to speed things up.",
      },
      {
        q: "My application was rejected. What now?",
        a: "The reviewer's reason is shown on the Organizer page. Choose Fix and resubmit: your earlier answers are kept, so you only change what was flagged.",
      },
    ],
  },
  {
    id: "events",
    title: "Events",
    questions: [
      {
        q: "Why does every event need its own permit?",
        a: "Each event is reviewed on its own. The crowd permit or venue approval must name the venue, the date and the capacity of that event.",
      },
      {
        q: "When does my event go on sale?",
        a: "As soon as it is approved. There is no separate publish step.",
      },
      {
        q: "What can I change after the event is live?",
        a: "Only the banner and the description. Dates, venue, tiers and prices stay as approved so buyers get what they paid for.",
      },
      {
        q: "Do I need a seat map?",
        a: "No, it is optional. If you add one, buyers see it next to the ticket tiers, so name the areas after your tiers.",
      },
    ],
  },
  {
    id: "tickets",
    title: "Tickets and promo codes",
    questions: [
      {
        q: "How many tickets can one buyer take?",
        a: `Up to ${MAX_TICKETS_PER_TRANSACTION} per order. You can set a lower limit per tier.`,
      },
      {
        q: "Can I delete a promo code?",
        a: "Only if nobody has used it yet. A code that has been used can be turned off, so past bookings keep their discount history.",
      },
    ],
  },
  {
    id: "gate",
    title: "Gate and check-in",
    questions: [
      {
        q: "How do gatekeepers sign in?",
        a: "Create their account under Gatekeepers and pass on the sign-in details. They use the normal login page and only see the scanner and the visitor count of the events you assign.",
      },
      {
        q: "When can tickets be scanned?",
        a: `From ${GATE_OPENS_HOURS_BEFORE} hours before a session starts until ${GATE_CLOSES_HOURS_AFTER} hour after. Each ticket gets in once; a second scan is flagged as already used.`,
      },
      {
        q: "What if there is no signal at the venue?",
        a: "Scans are kept on the gatekeeper's phone and checked as soon as the connection is back.",
      },
    ],
  },
  {
    id: "payouts",
    title: "Payouts",
    questions: [
      {
        q: "When do I get paid?",
        a: "3 days after an event ends. The platform fee for that event (between 5% and 10%) is deducted first.",
      },
      {
        q: "Where does the money go?",
        a: "To the bank account shown on the Payouts page.",
      },
    ],
  },
];

export function HelpFaq() {
  return (
    <div className="space-y-6">
      {TOPICS.map((topic) => (
        <section
          key={topic.id}
          aria-labelledby={`help-${topic.id}`}
          className="grid gap-4 rounded-[20px] bg-bg-surface p-6 sm:p-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12"
        >
          <h2 id={`help-${topic.id}`} className="font-heading text-xl font-semibold">
            {topic.title}
          </h2>
          <Accordion type="single" collapsible>
            {topic.questions.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-text-primary/10">
                <AccordionTrigger className="text-base font-semibold">{item.q}</AccordionTrigger>
                <AccordionContent className="text-text-primary/80">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>
  );
}
