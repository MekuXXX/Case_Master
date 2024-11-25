import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-scene relative w-full max-w-2xl">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="mb-2 text-center text-6xl font-bold">404</h1>
          <h2 className="mb-4 text-center text-3xl font-semibold">
            Oops! You're lost in space
          </h2>
          <div className="astronaut mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 300 300"
              fill="none"
            >
              <circle cx="150" cy="150" r="100" fill="#E0E0E0" />
              <circle cx="150" cy="150" r="90" fill="#BDBDBD" />
              <rect
                x="120"
                y="80"
                width="60"
                height="80"
                rx="30"
                fill="#E0E0E0"
              />
              <circle cx="150" cy="110" r="25" fill="#9E9E9E" />
              <rect
                x="135"
                y="160"
                width="30"
                height="60"
                rx="15"
                fill="#E0E0E0"
              />
              <rect
                x="105"
                y="170"
                width="30"
                height="60"
                rx="15"
                fill="#E0E0E0"
                transform="rotate(-30 105 170)"
              />
              <rect
                x="195"
                y="170"
                width="30"
                height="60"
                rx="15"
                fill="#E0E0E0"
                transform="rotate(30 195 170)"
              />
            </svg>
          </div>
          <p className="mb-8 max-w-md text-center text-xl">
            Don't worry, our astronaut will guide you back to Earth!
          </p>
          <Link href="/">
            <Button variant="outline" size="lg">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
