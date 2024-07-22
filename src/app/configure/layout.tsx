import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ConfigureLayout({ children }: Props) {
  return <MaxWidthWrapper>{children}</MaxWidthWrapper>;
}
