"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";

type ButtonLinkProps = Pick<ComponentProps<typeof Button>, "variant" | "size" | "className" | "hoverScale"> & {
  href: string;
  children: ReactNode;
};

// Server components must use this instead of <Button asChild><Link/></Button>:
// Animate UI's Slot reads the child's element type, which is not available for
// elements that cross the server/client boundary. Here the Link is created on the client.
export function ButtonLink({ href, children, hoverScale = 1, ...buttonProps }: ButtonLinkProps) {
  return (
    <Button asChild hoverScale={hoverScale} {...buttonProps}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
