import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function MaxWidthWrapper({ children, className }: Props) {
  return (
    <div
      className={cn(
        "max-screen-xl mx-auto h-full w-full px-2.5 md:px-24",
        className,
      )}
    >
      {children}
    </div>
  );
}
