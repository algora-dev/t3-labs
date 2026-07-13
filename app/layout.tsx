import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T3 Labs | Product Studio",
  description: "T3 Labs uses the best available technology to create solutions to real problems.",
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
