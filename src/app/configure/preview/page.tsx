import DesignPreview from "@/components/custom/DesignPreview";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  searchParams: {
    id: string | undefined;
  };
};

export default async function PreviewPage({ searchParams: { id } }: Props) {
  if (!id || typeof id !== "string") {
    return notFound();
  }

  const config = await db.configuration.findUnique({ where: { id } });

  if (!config) {
    return notFound();
  }

  return <DesignPreview config={config} />;
}
