import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Audit - Find your biggest business bottleneck",
  description: "Answer a few quick questions and get a clear, specific insight into what may be holding your business back. Free in about 3 minutes.",
};

export default function BusinessAuditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ margin: 0, padding: 0, background: "#f5f5f2", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
