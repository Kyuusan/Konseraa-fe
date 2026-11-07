// Label shown beside an icon-only rail item. The trigger must carry `group/rail`
// and its own sr-only label; this copy is visual only.
export function SidebarTooltip({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-[calc(100%+16px)] z-50 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-text-primary px-3 py-1.5 text-xs font-semibold text-bg-base opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-150 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-visible/rail:translate-x-0 group-focus-visible/rail:opacity-100 motion-reduce:transition-none before:absolute before:top-1/2 before:-left-1 before:size-2 before:-translate-y-1/2 before:rotate-45 before:bg-text-primary"
    >
      {label}
    </span>
  );
}
