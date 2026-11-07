import type { ReactNode } from "react";
import { AuthShell } from "./authShell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthShell panelLine="Find your next" panelHighlight="stage.">
      {children}
    </AuthShell>
  );
}
