import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  imgSrc: string;
  dark?: boolean;
};

export default function Phone({
  imgSrc,
  className,
  dark = false,
  ...props
}: Props) {
  return (
    <div
      className={cn("pointer-events-none relative z-50 overflow-hidden")}
      {...props}
    >
      <Image
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        alt="phone template"
        width={200}
        height={100}
        className="pointer-events-none z-50 select-none"
      />

      <div className="absolute inset-0 -z-10">
        <Image
          src={imgSrc}
          alt="overlaying phone image"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
