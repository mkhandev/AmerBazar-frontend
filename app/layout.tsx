import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "next-themes";
import { ReactQueryProviders } from "@/components/ReactQueryProviders";
import Footer from "@/components/Footer/Index";
import { Toaster } from "@/components/ui/sonner";
import { Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const roboto = Roboto({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AmerBazar",
  description: "AmerBazar Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.className}>
      <body suppressHydrationWarning>
        <SessionProvider>
          <ReactQueryProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="container mx-auto">{children}</main>
              <Toaster />
              <Footer />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
