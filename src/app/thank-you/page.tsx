import React, { Suspense } from "react";
import ThankYou from "@/components/custom/ThankYou";

type Props = {};

export default function ThankYouPage({}: Props) {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
}
