"use client";
import { forgetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  ForgetPasswordSchema,
  forgetPasswordShema,
} from "@/schemas/forget-password";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

type Props = {};

export default function ForgetPasswordForm({}: Props) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordShema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgetPasswordSchema) {
    startTransition(async () => {
      const res = await forgetPasswordAction(values);
      if (res?.error) {
        toast({
          title: "Something went wrong",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your mailbox",
          description: res.success,
        });
        form.reset();
      }
    });
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Input placeholder="m@example.com" {...form.register("email")} />

      <Button
        className="flex w-full items-center gap-2"
        type="submit"
        disabled={isPending}
        isLoading={isPending}
        loadingText="Sending email"
      >
        <Mail /> <span>Send reset link</span>
      </Button>
    </form>
  );
}
