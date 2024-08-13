// bg-zinc-900 border-zinc-900
// bg-blue-950 border-blue-950
// bg-rose-950 border-rose-950

import { PRODUCTS_PRICES } from "@/config/products";
import {
  CASE_COLOR,
  CASE_FINISH,
  CASE_MATERIAL,
  PHONE_MODEL,
} from "@prisma/client";

export const COLORS = [
  {
    label: "Black", // Default
    value: CASE_COLOR.BLACK,
    tw: "zinc-900",
  },
  {
    label: "Blue",
    value: CASE_COLOR.BLUE,
    tw: "blue-950",
  },
  {
    label: "Rose",
    value: CASE_COLOR.ROSE,
    tw: "rose-950",
  },
] as const;

export const MODELS = {
  name: "models",
  options: [
    {
      label: "iPhone X",
      value: PHONE_MODEL.IPHONEX,
    },
    {
      label: "iPhone 11",
      value: PHONE_MODEL.IPHONE11,
    },
    {
      label: "iPhone 12",
      value: PHONE_MODEL.IPHONE12,
    },
    {
      label: "iPhone 13",
      value: PHONE_MODEL.IPHONE13,
    },
    {
      label: "iPhone 14",
      value: PHONE_MODEL.IPHONE14,
    },
    {
      label: "iPhone 15",
      value: PHONE_MODEL.IPHONE15,
    },
  ],
} as const;

export const MATERIALS = {
  name: "material",
  options: [
    {
      label: "Silicone",
      value: CASE_MATERIAL.SILICON,
      description: undefined,
      price: PRODUCTS_PRICES.material.silicon,
    },
    {
      label: "Soft Polycarbonate",
      value: CASE_MATERIAL.SOFT_POLYCARBONATE,
      description: "Scratch-resistant coating",
      price: PRODUCTS_PRICES.material.polycarbonate,
    },
  ],
} as const;

export const FINISHES = {
  name: "finish",
  options: [
    {
      label: "Smooth Finish",
      value: CASE_FINISH.SMOOTH,
      description: undefined,
      price: PRODUCTS_PRICES.finish.smooth,
    },
    {
      label: "Textured Finish",
      value: CASE_FINISH.TEXTURED,
      description: "Soft grippy texture",
      price: PRODUCTS_PRICES.finish.textured,
    },
  ],
} as const;
