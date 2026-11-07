import type { ReactNode } from "react";

// Sticky, borderless headbar frame shared by the user and admin headbars.
// 84px tall from sm up: the organizer and admin sidebars are offset by this.
export function HeadbarShell({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 bg-bg-base/85 px-3 pt-5 pb-3 backdrop-blur-md sm:px-6 sm:pt-6">
      <div className="relative h-12">{children}</div>
    </header>
  );
}
