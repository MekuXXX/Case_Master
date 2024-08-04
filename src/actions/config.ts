"use server";

import db from "@/lib/db";
import {
  CASE_COLOR,
  CASE_FINISH,
  CASE_MATERIAL,
  PHONE_MODEL,
} from "@prisma/client";

export type SaveConfigParams = {
  configId: string;
  model: PHONE_MODEL;
  color: CASE_COLOR;
  material: CASE_MATERIAL;
  finish: CASE_FINISH;
};

export async function saveConfig(params: SaveConfigParams) {
  const { color, model, configId, material, finish } = params;

  try {
    await db.configuration.update({
      where: {
        id: configId,
      },

      data: {
        color,
        material,
        finish,
        model,
      },
    });
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
