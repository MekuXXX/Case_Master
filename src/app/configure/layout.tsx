import UploadSteps from "@/components/custom/UploadForm/UploadSteps";
import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ConfigureLayout({ children }: Props) {
  return (
    <MaxWidthWrapper className="">
      <UploadSteps />
      {children}
    </MaxWidthWrapper>
  );
}
