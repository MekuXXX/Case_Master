import { Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import { cn, constructMetadata } from "@/lib/utils";
import Footer from "@/components/global/Footer";
import { Toaster } from "@/components/ui/toaster";
import TanstackQueryProvider from "@/components/provider/TanstackQueryProvider";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata = constructMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "grainy-light flex min-h-screen flex-col",
          recursive.className,
        )}
      >
        <TanstackQueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
