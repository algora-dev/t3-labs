import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Falcon Contracting Ltd | New Roofs and Construction in Essex",
  description:
    "Falcon Contracting Ltd is a Long Green, Essex roofing and construction business serving Essex, London, the East of England and the Home Counties.",
  robots: {
    index: false,
    follow: false,
  },
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
