import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Link from "next/link";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="relative h-20 bg-white">
      <MaxWidthWrapper>
        <div className="boder-t border-gray-200" />
        <div className="flex h-full flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="pb-2 text-center md:pb-0 md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; Copyrigh {new Date().getFullYear()} All right reserved
            </p>
          </div>

          <div className="flex items-center">
            <div className="flex space-x-8">
              <Link
                href={"#"}
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Terms
              </Link>
              <Link
                href={"#"}
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Privary Policy
              </Link>
              <Link
                href={"#"}
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
