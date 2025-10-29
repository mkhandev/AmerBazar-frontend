import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "next-themes";
import { ReactQueryProviders } from "@/components/ReactQueryProviders";
import Footer from "@/components/Footer/Index";

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReactQueryProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="container mx-auto">{children}</main>
            <Footer />
          </ThemeProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
