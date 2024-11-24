import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/actions/auth";

type Props = {};

export default async function Navbar({}: Props) {
  const session = await auth();

  // Note: For view now I will ADMIN_EMAIL to null to make this page visible for viewer
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL;

  return (
    <nav className="sticky inset-x-0 top-0 z-[100] h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="z-40 flex font-semibold capitalize">
            Case <span className="text-green-600">Master</span>
          </Link>

          <div className="flex h-full items-center space-x-4">
            {/*Note: Must be protected but I make this just for the viewer*/}
            <Link
              href={"/dashboard"}
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              Dashboard 💫
            </Link>
            {session?.user ? (
              <form action={signOutAction}>
                <Button variant={"ghost"} size={"sm"}>
                  Logout
                </Button>
              </form>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </Link>
                <Link
                  href={"/register"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Create an account
                </Link>

                <div className="hidden h-8 w-px bg-zinc-200 md:block" />
              </>
            )}

            <Link
              href={"/configure/upload"}
              className={buttonVariants({
                size: "sm",
                className: "hidden items-center gap-1 md:flex",
              })}
            >
              Create case
              <ArrowRight className="ml-1.5 h-5 w-5" />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
