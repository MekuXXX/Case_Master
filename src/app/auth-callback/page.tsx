"use client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

export default function AuthCallbackPage({}: Props) {
  const router = useRouter();
  const [configId, setConfigId] = useState<string | undefined>(undefined);
  const { data = { success: false }, isLoading } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => {
      // const res = await getAuthStatus(); // NOTE: There is problem when trying to use this action here as it return undefined
      const res = await fetch("/api/auth-status");
      const data = await res.json();
      // // Note: I do this
      // window.localStorage.setItem("email", data.email);
      return data;
    },
    retry: true,
    retryDelay: parseFloat(process.env.NEXT_PUBLIC_QUERY_RETRY ?? "500"),
  });

  useEffect(() => {
    const configurationId = window.localStorage.getItem("configId");

    if (configurationId) {
      setConfigId(configurationId);
    }

    if (data?.success) {
      if (configId) {
        window.localStorage.removeItem("configId");
        router.push(`/configure/preview?id=${configId}`);
      } else {
        router.push(`/`);
      }
    }
  }, [data, configId, router]);

  return (
    <div className="mt-24 flex w-full justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="text-xl font-semibold">Loggin you in...</h3>
        <p className="text-sm text-gray-500">
          You will be redirected automatically
        </p>
      </div>
    </div>
  );
}
