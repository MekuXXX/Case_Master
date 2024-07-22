import Phone from "@/components/global/Phone/inedx";
import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  imgSrc: string;
};

const POSSIBLE_ANIMATION_DELAY = ["0s", "0.1s", "0.2s", "0.3s", "0.4s", "0.5s"];

export default function Review({ imgSrc, className, ...props }: Props) {
  const animationDelay =
    POSSIBLE_ANIMATION_DELAY[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAY.length)
    ];

  return (
    <div
      className={cn(
        "animate-fade-in opactity-0 rounded-[2.25rem] bg-white p-6 shadow-xl shadow-slate-900/5",
        className,
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
}
