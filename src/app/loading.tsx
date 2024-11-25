import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24 animate-pulse rounded-full border-4 border-gray-300"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
      <p className="mt-4 animate-pulse text-xl font-semibold text-primary">
        Loading...
      </p>
    </div>
  );
}
