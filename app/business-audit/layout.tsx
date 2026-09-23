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
    <div style={{ margin: 0, padding: 0, background: "radial-gradient(circle at 76% 6%, rgba(16, 23, 34, 0.05), transparent 24rem), radial-gradient(circle at 14% 36%, rgba(48, 61, 81, 0.06), transparent 20rem), #f5f6f8", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
