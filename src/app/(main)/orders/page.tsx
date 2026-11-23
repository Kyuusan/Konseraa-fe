import { getUserOrders } from "@/__fixtures__/orders";
import { toCheckoutQuery } from "@/components/userComponent/checkout/checkoutParams";
import { OrderCard } from "@/components/userComponent/orders/orderCard";
import { OrderTabs } from "@/components/userComponent/orders/orderTabs";
import { SectionTabs } from "@/components/userComponent/shared/sectionTabs";
import { TICKET_SECTIONS } from "@/components/userComponent/shared/ticketSections";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import type { BookingStatus } from "@/types/booking";

const GROUPS: { value: string; label: string; statuses: BookingStatus[] | null }[] = [
  { value: "all", label: "All", statuses: null },
  { value: "awaiting", label: "To pay", statuses: ["pending", "awaiting_payment"] },
  { value: "paid", label: "Paid", statuses: ["paid"] },
  { value: "closed", label: "Expired and refunded", statuses: ["expired", "cancelled", "refunded", "partially_refunded"] },
];

export default function Page() {
  const orders = getUserOrders().map(({ order, resume }) => ({
    order,
    node: (
      <OrderCard
        order={order}
        resumeHref={resume ? `/payment/${order.booking_code}?${toCheckoutQuery(resume.selection, resume.extra)}` : null}
      />
    ),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tickets"
        title="My orders"
        description="Every booking you made, including ones still waiting for payment."
        actions={<SectionTabs label="Tickets and orders" items={TICKET_SECTIONS} />}
        actionsAlign="center"
      />
      <OrderTabs
        groups={GROUPS.map((group) => ({
          value: group.value,
          label: group.label,
          cards: orders
            .filter(({ order }) => group.statuses === null || group.statuses.includes(order.status))
            .map(({ order, node }) => ({ id: order.booking_code, node })),
        }))}
      />
    </div>
  );
}
