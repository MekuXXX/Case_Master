import { signInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { AuthenticationAction } from "@/lib/auth";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";

type Props = {};

export default function ProvidersButtons({}: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <form
        action={async () => await signInAction(AuthenticationAction.GITHUB)}
      >
        <Button variant="outline" className="w-full">
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
          Github
        </Button>
      </form>
      <form
        action={async () => await signInAction(AuthenticationAction.GOOGLE)}
      >
        <Button variant="outline" className="w-full">
          <Image
            src={"/google-icon.png"}
            alt="Google icon"
            width={16}
            height={16}
            aria-hidden
            className="mr-2"
          />
          Google
        </Button>
      </form>
    </div>
  );
}
