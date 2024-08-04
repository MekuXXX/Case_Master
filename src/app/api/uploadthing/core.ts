import { createUploadthing, type FileRouter } from "uploadthing/next";
import sharp from "sharp";
import * as z from "zod";
import db from "@/lib/db";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;

      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();

      const imageMetadate = await sharp(buffer).metadata();
      const { width, height } = imageMetadate;

      if (!configId) {
        const config = await db.configuration.create({
          data: {
            imageUrl: file.url,
            width: width || 300,
            height: height || 500,
          },
        });

        return { configId: config.id };
      }

      const updatedConfig = await db.configuration.update({
        where: {
          id: configId,
        },
        data: {
          croppedImageUrl: file.url,
        },
      });

      return { configId: updatedConfig.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
