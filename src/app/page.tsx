import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";
import Phone from "@/components/global/Phone/inedx";
import { Check, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-slate-50">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-3 lg:gap-x-0 lg:pb-52 lg:pt-24 xl:gap-x-8 xl:pt-32">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto flex-col items-center text-center lg:items-start lg:text-left">
              <div className="absolute -top-24 left-0 hidden w-28 lg:block">
                <Image
                  src={"/snake-1.png"}
                  alt="snake image"
                  width={80}
                  height={80}
                />
              </div>
              <h1 className="relative mt-16 w-fit text-balance text-5xl font-bold !leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
                Your Image on a{" "}
                <span className="bg-green-600 px-2 text-white">Custom</span>{" "}
                Phone Case
              </h1>
              <p className="mt-8 max-w-prose text-balance text-center text-lg md:text-wrap lg:pr-10 lg:text-left">
                Capture your favorite memories with your own,{" "}
                <span className="font-semibold">one-of-oni</span> phone case.
                CaseCobra allows you to protect your memories, not just you
                phone case.
              </p>

              <ul className="mt-8 flex flex-col items-center space-y-2 text-left font-medium sm:items-start">
                <div className="space-y-2">
                  <li className="flex items-center gap-1.5 text-left">
                    <Check className="shrik-0 h-5 w-5 text-green-600" />
                    High quality, durable material
                  </li>

                  <li className="flex items-center gap-1.5 text-left">
                    <Check className="shrik-0 h-5 w-5 text-green-600" />5 year
                    print guarantee
                  </li>

                  <li className="flex items-center gap-1.5 text-left">
                    <Check className="shrik-0 h-5 w-5 text-green-600" />
                    Modern iPhone models supported
                  </li>
                </div>
              </ul>

              <div className="mv-12 flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                <div className="flex -space-x-4">
                  <Image
                    src={"/users/user-1.png"}
                    alt="user 1 image"
                    width={40}
                    height={40}
                    className="inline-block rounded-full ring-2 ring-slate-100"
                  />

                  <Image
                    src={"/users/user-2.png"}
                    alt="user 1 image"
                    width={40}
                    height={40}
                    className="inline-block rounded-full ring-2 ring-slate-100"
                  />

                  <Image
                    src={"/users/user-3.png"}
                    alt="user 1 image"
                    width={40}
                    height={40}
                    className="inline-block rounded-full ring-2 ring-slate-100"
                  />

                  <Image
                    src={"/users/user-4.jpg"}
                    alt="user 1 image"
                    width={40}
                    height={40}
                    className="inline-block rounded-full ring-2 ring-slate-100"
                  />

                  <Image
                    src={"/users/user-5.jpg"}
                    alt="user 1 image"
                    width={40}
                    height={40}
                    className="inline-block rounded-full object-cover ring-2 ring-slate-100"
                  />
                </div>

                <div className="flex flex-col items-center justify-between sm:items-start">
                  <div className="flex gap-0.5">
                    <Star className="h-4 w-4 fill-green-600 text-green-600" />
                    <Star className="h-4 w-4 fill-green-600 text-green-600" />
                    <Star className="h-4 w-4 fill-green-600 text-green-600" />
                    <Star className="h-4 w-4 fill-green-600 text-green-600" />
                    <Star className="h-4 w-4 fill-green-600 text-green-600" />
                  </div>

                  <p>
                    <span className="font-semibold">1,250</span> happy customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full mt-32 flex w-full justify-center px-8 sm:px-16 md:px-0 lg:col-span-1 lg:mx-0 lg:mt-20">
            <div className="relative max-h-[27rem] md:max-w-xl">
              <Image
                src={"/your-image.png"}
                alt="Your image"
                width={300}
                height={300}
                className="absolute -right-36 -top-24 hidden w-40 select-none lg:w-52 xl:block"
              />

              <Image
                src={"/line.png"}
                alt="line image"
                width={140}
                height={140}
                className="absolute -bottom-6 -left-6 select-none"
              />

              <Phone className="w-64" imgSrc="/testimonials/1.jpg" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </main>
  );
}
