import { BASE_PRICE, PRODUCTS_PRICES } from "@/config/products";
import { CASE_FINISH, CASE_MATERIAL, Configuration } from "@prisma/client";

export function calculateTotalPrice(config: Configuration) {
  const { material, finish } = config;
  let totalPrice = BASE_PRICE;

  if (material === CASE_MATERIAL.SOFT_POLYCARBONATE) {
    totalPrice += PRODUCTS_PRICES.material.polycarbonate;
  }

  if (finish === CASE_FINISH.TEXTURED) {
    totalPrice += PRODUCTS_PRICES.finish.textured;
  }

  return totalPrice;
}
