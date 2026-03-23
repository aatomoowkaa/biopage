import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "biopage.lol | Your premium bio link",
  description: "Create your own premium bio link page with background effects, music, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistSans.variable}>
        <div className="container">
          {/* @ts-ignore */}
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
