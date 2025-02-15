import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { sansDM, sansPub } from "./fonts";
import "./styles/globals.css";
import LoadingSpinner from "@/components/ui/spinners/LoadingSpinner/LoadingSpinner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPA-приложение: Комментарии",
  description: "Здесь вы можете прокомментировать все, что угодно",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${sansDM.variable} 
          ${sansPub.variable} 
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased
        `}
      >
        <LoadingSpinner />
        {children}
      </body>
    </html>
  );
}
