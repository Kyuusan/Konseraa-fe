import type { ReactNode } from "react";
import { AuthShell } from "@/app/(auth)/authShell";

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <AuthShell panelLine="Keep the stage" panelHighlight="real.">
      {children}
    </AuthShell>
  );
}
