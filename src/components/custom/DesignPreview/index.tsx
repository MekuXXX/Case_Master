"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { CASE_FINISH, CASE_MATERIAL, Configuration } from "@prisma/client";
import Phone from "@/components/global/Phone/inedx";
import { COLORS, MODELS } from "@/schemas/option-validator";
import { cn, formatPrice } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import { BASE_PRICE, PRODUCTS_PRICES } from "@/config/products";
import { Button } from "@/components/ui/button";
import { calculateTotalPrice } from "@/lib/configuration";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import LoginModal from "@/components/global/LoginModal";
import { User } from "next-auth";

type Props = {
  config: Configuration;
  user?: (User & { id: string }) | null;
};

export default function DesignPreview({ config, user }: Props) {
  const { color, model, croppedImageUrl, finish, material, id } = config;
  const twColor = COLORS.find(
    (supportedColor) => supportedColor.value === color,
  )?.tw;
  const modelLabel = MODELS.options.find(
    (supportedModel) => supportedModel.value === model,
  )?.label;

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: async ({ configId }: { configId: string }) => {
      const res = await fetch("/api/stripe-session", {
        method: "POST",
        body: JSON.stringify({ configId }),
      });
      const data = (await res.json()) as { url: string | undefined };
      return data;
    },
    onSuccess: ({ url }) => {
      if (url) {
        router.replace(url);
      } else {
        throw new Error("Unable to retrieve payment URL");
      }
    },

    onError: ({}) => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckoutSession = async () => {
    if (user?.email) {
      createPaymentSession({ configId: id });
    } else {
      window.localStorage.setItem("configId", id);
      setIsLoginModalOpen(true);
    }
  };

  useEffect(() => {
    setShowConfetti(true);
  }, [setShowConfetti]);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 flex select-none justify-center overflow-clip">
        <Confetti
          active={showConfetti}
          config={{ elementCount: 400, spread: 90 }}
        />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 flex flex-col items-center text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:grid md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 md:row-span-2 md:row-end-2 lg:col-span-3">
          <Phone
            className={cn(`bg-${twColor}`, "max-w-[9.25rem] md:max-w-full")}
            imgSrc={croppedImageUrl!}
          />
        </div>
        <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship
          </div>
          <div className="md:cols-span-9 text-base sm:col-span-12">
            <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
              <div>
                <p className="font-medium text-zinc-950">Highlights</p>
                <ol className="mt-3 list-inside list-disc text-zinc-700">
                  <li>Wireless charging compatible</li>
                  <li>TPU shock absorption</li>
                  <li>Packaging made from recycled materials</li>
                  <li>5 year print warranty</li>
                </ol>
              </div>

              <div>
                <p className="font-medium text-zinc-950">Materials</p>
                <ol className="mt-3 list-inside list-disc text-zinc-700">
                  <li>High-quality, durable material</li>
                  <li>Scratch and fingerprint resistant coating</li>
                </ol>
              </div>
            </div>
            <div className="mt-8">
              <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
                <div className="flow-root text-sm">
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Base price</p>
                    <p className="font-medium text-indigo-900">
                      {formatPrice(BASE_PRICE / 100)}
                    </p>
                  </div>

                  {finish === CASE_FINISH.TEXTURED && (
                    <div className="mt-2 flex items-center justify-between py-1">
                      <p className="text-gray-600">Textured finish</p>
                      <p className="font-medium text-indigo-900">
                        {formatPrice(PRODUCTS_PRICES.finish.textured / 100)}
                      </p>
                    </div>
                  )}

                  {material === CASE_MATERIAL.SOFT_POLYCARBONATE && (
                    <div className="mt-2 flex items-center justify-between py-1">
                      <p className="text-gray-600">
                        Soft polycarbonate material
                      </p>
                      <p className="font-medium text-indigo-900">
                        {formatPrice(
                          PRODUCTS_PRICES.material.polycarbonate / 100,
                        )}
                      </p>
                    </div>
                  )}

                  <div className="my-2 h-px bg-gray-200" />

                  <div className="flex items-center justify-between py-2">
                    <p className="font-semibold text-gray-900">Order total</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(calculateTotalPrice(config) / 100)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end pb-12">
                <Button
                  onClick={() => handleCheckoutSession()}
                  className="px-4 sm:px-6 lg:px-8"
                >
                  Check out <ArrowRight className="ml-1.5 inline h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
