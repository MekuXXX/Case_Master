"use client";
import { getPaymentStatus } from "@/actions/stripe";
import PhonePreview from "@/components/global/Phone/PhonePreview";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

type Props = {};

export default function ThankYou({}: Props) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const { data, isLoading } = useQuery({
    queryKey: ["thank-you"],
    queryFn: async () => {
      const res = await fetch("/api/payment-status", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      });
      console.log("HItted");

      const data = (await res.json()) as Awaited<
        ReturnType<typeof getPaymentStatus>
      >;
      return data;
    },
    retry: true,
    retryDelay: Number(process.env.NEXT_PUBLIC_QUERY_RETRY),
  });

  if (data === undefined) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">Loading your order...</h3>
          <p className="text-sm text-zinc-600">This won't take long</p>
        </div>
      </div>
    );
  }

  if (!data.success) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">Verifying your payment...</h3>
          <p className="text-sm text-zinc-600">This might take a moment</p>
        </div>
      </div>
    );
  }
  const { configuration, billingAddress, shippingAddress, amount } =
    data.order!;

  console.log(configuration);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is in the way
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We've recieved your order and are no processing it.
          </p>
          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
          <div className="mt-10 border-t border-zinc-200">
            <div className="mt-10 flex flex-auto flex-col">
              <h4 className="font-semibold text-zinc-900">
                You made a great choice!
              </h4>
              <p className="mt-2 text-sm text-zinc-600">
                We at CaseCobra believe that a phone case doesn't only need to
                look good, but also last you for the years to come. We offer a
                5-year print guarantee: If you case isn't of the highest
                quality, we'll replace it for free.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-6 overflow-clip rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview
            croppedImageUrl={configuration.croppedImageUrl!}
            color={configuration.color!}
          />
        </div>

        <div>
          <div className="gap-x--6 grid grid-cols-2 py-10 text-sm">
            <div>
              <p className="font-medium text-gray-900">Shipping address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{shippingAddress?.name}</span>
                  <span className="block">{shippingAddress?.street}</span>
                  <span className="block">
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-900">Billing address</p>
            <div className="mt-2 text-zinc-700">
              <address className="not-italic">
                <span className="block">{billingAddress?.name}</span>
                <span className="block">{billingAddress?.street}</span>
                <span className="block">
                  {billingAddress?.postalCode} {billingAddress?.city}
                </span>
              </address>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>
            <div>
              <p className="font-medium text-zinc-900">Shipping Method</p>
              <p className="mt-2 text-zinc-700">
                DHL, takes up to 3 working days
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>

          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <p className="text-zinc-700">{formatPrice(0)}</p>
          </div>

          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
