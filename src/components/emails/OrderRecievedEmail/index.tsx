import { ShippingAddress } from "@prisma/client";
import React from "react";

type Props = {
  shippingAddress: ShippingAddress;
};

export default function OrderRecievedEmail({ shippingAddress }: Props) {
  return <div>OrderRecievedEmail</div>;
}
