import DesignConfigurator from "@/components/custom/DesignConfigurator";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  searchParams: {
    id: string | undefined;
  };
};

export default async function DesignPage({ searchParams }: Props) {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id: id },
  });

  if (!configuration) {
    return notFound();
  }

  return <DesignConfigurator config={configuration} />;
}
