import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pollen LMS - Lily AI Demo",
  description: "Pollen Listing Management System powered by Lily AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
