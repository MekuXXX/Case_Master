import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { COLORS } from "@/schemas/option-validator";
import { CASE_COLOR } from "@prisma/client";
import { CloudLightning } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  croppedImageUrl: string;
  color: CASE_COLOR;
};

export default function PhonePreview({ croppedImageUrl, color }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [renderedDimensions, setRenderedDimensions] = useState({
    height: 0,
    width: 0,
  });

  const handleResize = () => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    setRenderedDimensions({ width, height });
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [ref.current]);

  let caseBackgroundColor =
    COLORS.find((appColor) => color === appColor.value)?.tw ?? "zinc-900";

  return (
    <AspectRatio ref={ref} ratio={3000 / 2001} className="relative">
      <div
        className="absolute z-20 scale-[1.0352]"
        style={{
          left:
            renderedDimensions.width / 2 -
            renderedDimensions.width / (1216 / 121),
          top: renderedDimensions.height / 6.22,
        }}
      >
        <img
          width={renderedDimensions.width / (3000 / 637)}
          className={cn(
            "phone-skew relative z-20 rounded-b-[10px] rounded-t-[15px] md:rounded-b-[20px] md:rounded-t-[30px]",
            `bg-${caseBackgroundColor}`,
          )}
          src={croppedImageUrl}
        />
      </div>

      <div className="relative z-40 h-full w-full">
        <img
          alt="phone"
          src="/clearphone.png"
          className="pointer-events-none h-full w-full rounded-md antialiased"
        />
      </div>
    </AspectRatio>
  );
}