"use server";

import db from "@/lib/db";
import { ORDER_STATUS } from "@prisma/client";

type ChangeOrderStatusParams = {
  id: string;
  newStatus: ORDER_STATUS;
};

export async function changeOrderStatus(params: ChangeOrderStatusParams) {
  const { id, newStatus } = params;
  await db.order.update({ where: { id }, data: { status: newStatus } });
  return true;
}
