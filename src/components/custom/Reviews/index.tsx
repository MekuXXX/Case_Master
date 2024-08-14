import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";
import Image from "next/image";
import React from "react";
import ReviewsGrid from "@/components/custom/Reviews/ReviewsGrid";

type Props = {};

export default function Reviews({}: Props) {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <Image
        src={"/what-people-are-buying.png"}
        alt="what peaple are buying"
        width={150}
        height={150}
        className="absolute -left-32 top-1/3 hidden select-none xl:block"
        aria-hidden="true"
      />

      <ReviewsGrid />
    </MaxWidthWrapper>
  );
}
