import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Get more leads, win more jobs | T3 Labs",
  description:
    "Book a 25-minute discovery call with Shaun, or answer a 60-second questionnaire and get a tailored proposal and price within 48 hours. Either way you'll also get Shaun's #1 tip for winning more jobs.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
