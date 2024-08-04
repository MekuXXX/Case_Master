import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Image from "next/image";
import React from "react";

type Props = {};

type Step = {
  name: string;
  description: string;
  url: string;
};

const STEPS: Step[] = [
  {
    name: "Step 1: Add image",
    description: "Choose an image for your case",
    url: "/upload",
  },
  {
    name: "Step 2: Customize design",
    description: "Make the case yours",
    url: "/design",
  },
  {
    name: "Step 3: Summary",
    description: "Review your final design",
    url: "/preview",
  },
];

export default function UploadSteps({}: Props) {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");

  console.log(pathname);
  return (
    <ol className="lg:border-1 rounded-md bg-white lg:flex lg:rounded-none lg:border-r lg:border-none lg:border-gray-200">
      {STEPS.map((step, index) => {
        const isCurrentStep = pathname?.endsWith(step.url);
        const isCompleted = STEPS.slice(index + 1).some((step) =>
          pathname?.endsWith(step.url),
        );

        const imagePath = `/snake-${index + 1}.png`;

        return (
          <li key={step.name} className="relative overflow-clip lg:flex-1">
            <div>
              <span
                className={cn(
                  "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                  { "bg-zinc-700": isCurrentStep, "bg-primary": isCompleted },
                )}
                aria-hidden="true"
              />

              <span
                className={cn(
                  index !== 0 ? "lg:pl-9" : "",
                  "flex items-center px-6 py-4 text-sm font-medium",
                )}
              >
                <span className="flex-shrink-0">
                  <Image
                    src={imagePath}
                    alt="Sake image"
                    width={80}
                    height={80}
                    className={cn(
                      "flex items-center justify-center object-contain",
                      {
                        "border-none": isCompleted,
                        "border-zinc-700": isCurrentStep,
                      },
                    )}
                  />
                </span>

                <span className="ml-4 mt-0.5 flex h-full min-w-0 flex-col justify-center">
                  <span
                    className={cn("text-sm font-semibold text-zinc-700", {
                      "text-primary": isCompleted,
                      "text-zinc-700": isCurrentStep,
                    })}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {step.description}
                  </span>
                </span>
              </span>

              {index !== 0 ? (
                <div className="absolute inset-0 hidden w-3 lg:block">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 12 82"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0.5 0V31L10.5 41L0.5 51V82"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
      <li></li>
    </ol>
  );
}
