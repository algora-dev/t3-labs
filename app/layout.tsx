import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T3 Labs | Websites built with purpose",
  description: "Digital design and development by T3 Labs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
