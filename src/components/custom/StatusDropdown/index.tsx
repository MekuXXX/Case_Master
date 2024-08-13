"use client";
import { changeOrderStatus } from "@/actions/order";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ORDER_STATUS } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  id: string;
  orderStatus: ORDER_STATUS;
};

const LABEL_MAP: Record<keyof typeof ORDER_STATUS, string> = {
  AWAIT_SHIPMENT: "Awaiting Shipment",
  FULLFILLED: "Fullfilled",
  SHIPPED: "Shipped",
};

export default function StatusDropdown({ id, orderStatus }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: changStatus } = useMutation({
    mutationKey: ["change-order-status"],
    mutationFn: changeOrderStatus,
    onSuccess: () => router.refresh(),
    onError: () => {
      toast({
        title: "Something went wrong!",
        description:
          "Error occured when trying to update the status, please try again",
        variant: "destructive",
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="flex w-52 items-center justify-between"
        >
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.keys(ORDER_STATUS).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100",
              {
                "bg-zinc-100": orderStatus === status,
              },
            )}
            onClick={() =>
              changStatus({ id, newStatus: status as ORDER_STATUS })
            }
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4 text-primary",
                orderStatus === status ? "opacity-100" : "opacity-0",
              )}
            />

            {LABEL_MAP[status as ORDER_STATUS]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
