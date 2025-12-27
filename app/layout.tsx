import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GearGuard - Maintenance Tracker",
  description: "The Ultimate Maintenance Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased h-screen overflow-auto bg-slate-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
