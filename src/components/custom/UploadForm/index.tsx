"use client";
import React, { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import Dropzone, { FileRejection } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type Props = {};

export default function UploadForm({}: Props) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress(prog) {
      setUploadProgress(prog);
    },
  });

  const onDropRejected = function (files: FileRejection[]) {
    const [file] = files;
    setIsDragOver(false);

    toast({
      title: `${file.file.type} type is not supported`,
      description: "Please choose a PNG, JPG, JPEG image istead",
      variant: "destructive",
    });
  };
  const onDropAccepted = function (acceptedFiles: File[]) {
    startUpload(acceptedFiles, { configId: undefined });

    setIsDragOver(false);
  };

  return (
    <div
      className={cn(
        "relative my-16 flex h-full w-full flex-col items-center justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl",
        { "bg-blue-900/10 ring-blue-900/25": isDragOver },
      )}
    >
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          onDragEnter={() => {
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="flex h-full min-h-[40vh] w-full flex-1 flex-col items-center justify-center lg:min-h-[60vh]"
              {...getRootProps()}
            >
              <Input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="mb-2 h-6 w-6 text-zinc-500" />
              ) : isUploading || isPending ? (
                <Loader2 className="mb-2 h-6 w-6 animate-spin text-zinc-500" />
              ) : (
                <Image className="mb-2 h-6 w-6 text-zinc-500" />
              )}
              <div className="mb-2 flex flex-col justify-center text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      className="mt-2 h-2 w-40 bg-gray-300"
                      value={uploadProgress}
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>

              {isPending ? undefined : (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}
