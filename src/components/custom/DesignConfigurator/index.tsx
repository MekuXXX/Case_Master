"use client";
import React, { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn, formatPrice } from "@/lib/utils";
import { Configuration } from "@prisma/client";
import NextImage from "next/image";
import HandleComponent from "@/components/custom/DesignConfigurator/HandleComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RadioGroup,
  Radio,
  Label as RadioLabel,
  Description as RadioDescription,
} from "@headlessui/react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/schemas/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { BASE_PRICE } from "@/config/products";
import { BLOB_TYPE, convertBase64ToBlob } from "@/lib/blob";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
  SaveConfigParams,
  saveConfig as saveConfigAction,
} from "@/actions/config";
import { useRouter } from "next/navigation";

type Props = {
  config: Configuration;
};

export default function DesignConfigurator({ config }: Props) {
  const { width, height, imageUrl } = config;
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: config.width / 4,
    height: config.height / 4,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();
  const { mutate: saveConfiguration } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigParams) => {
      await Promise.all([saveConfig(), saveConfigAction(args)]);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${config.id}`);
    },
  });

  async function saveConfig() {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();
      const { left: contLeft, top: contTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - contLeft;
      const topOffset = caseTop - contTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.src = config.imageUrl;
      userImage.crossOrigin = "anonymous";
      await new Promise((res) => (userImage.onload = res));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height,
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];
      const blob = convertBase64ToBlob(base64Data, BLOB_TYPE.PNG);
      const file = new File(
        [blob],
        `image-${config.id.slice(-8)}-${new Date().getSeconds()}.png`,
        {
          type: BLOB_TYPE.PNG,
        },
      );

      const res = await startUpload([file], { configId: config.id });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "There was a problem saving your config, please try again",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="relative mb-20 mt-20 grid grid-cols-1 pb-20 lg:grid-cols-3">
      <div
        ref={containerRef}
        className="relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-clip rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50">
          <AspectRatio
            ratio={896 / 1831}
            ref={phoneCaseRef}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              src={"/phone-template.png"}
              alt="Phone image"
              fill
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute inset-0 bottom-px left-[0.125rem] right-[0.125rem] top-px z-40 rounded-[2rem] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 bottom-px left-[0.125rem] right-[0.125rem] top-px rounded-[2rem]",
              `bg-${options.color.tw}`,
            )}
          />
        </div>
        <Rnd
          className="absolute z-20 border-[0.125rem] border-primary"
          default={{ x: 150, y: 205, width: width / 4, height: height / 4 }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              width: parseInt(ref.style.width.slice(0, -2)),
              height: parseInt(ref.style.height.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
          }}
          resizeHandleComponent={{
            bottomLeft: <HandleComponent />,
            bottomRight: <HandleComponent />,
            topLeft: <HandleComponent />,
            topRight: <HandleComponent />,
          }}
        >
          <div className="relative h-full w-full">
            <NextImage
              src={imageUrl}
              alt="User image"
              fill
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>

      <div className="col-span-full flex h-[37.5rem] w-full flex-col bg-white lg:col-span-1">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="inset x-0 pointer-events-none absolute bottom-0 z-10 h-12 bg-gradient-to-t from-white"
          />
          <div className="px-8 pb-12 pt-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Customize your case
            </h2>

            <div className="my-6 h-px w-full bg-zinc-200" />
            <div className="relative mt-4 flex h-full flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(value) =>
                    setOptions((prev) => {
                      return { ...prev, color: value };
                    })
                  }
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={({ checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 focus:outline-none focus:ring-0 active:outline-none active:ring-0",
                            { [`border-${color.tw}`]: checked },
                          )
                        }
                      >
                        <span
                          className={cn(
                            `bg-${color.tw} h-8 w-8 rounded-full border-black border-opacity-10`,
                          )}
                        />
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <div className="relative z-[999999] flex w-full flex-col gap-3">
                  <Label>Model:</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}{" "}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="rounded-lg bg-zinc-200">
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex cursor-default items-center gap-1 p-1.5 text-sm hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            },
                          )}
                          onClick={() =>
                            setOptions((prev) => ({ ...prev, model }))
                          }
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", {
                              "opacity-0": model.label !== options.model.label,
                            })}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) =>
                        setOptions((prev) => ({ ...prev, [name]: val }))
                      }
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <Radio
                            key={option.value}
                            value={option}
                            className={({ checked }) =>
                              cn(
                                "relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between",
                                {
                                  "border-primary": checked,
                                },
                              )
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioLabel
                                  as="span"
                                  className="font-medium text-gray-900"
                                >
                                  {option.label}
                                </RadioLabel>
                                {option.description && (
                                  <RadioDescription
                                    as="span"
                                    className="text-gray-500"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </RadioDescription>
                                )}
                              </span>
                            </span>

                            <RadioDescription
                              as="span"
                              className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            >
                              <span className="font-medium text-gray-900">
                                {formatPrice(option.price / 100)}
                              </span>
                            </RadioDescription>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  ),
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="h-16 w-full bg-white px-8">
          <div className="h-px w-full bg-zinc-200" />
          <div className="mt-6 h-full w-full items-center justify-end">
            <div className="flex w-full items-center gap-6">
              <p className="whitespace-nowrap font-medium">
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100,
                )}
              </p>
              <Button
                onClick={() =>
                  saveConfiguration({
                    configId: config.id,
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value,
                  })
                }
                size="sm"
                className="w-full"
              >
                Continue
                <ArrowRight className="ml-1.5 inline h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
