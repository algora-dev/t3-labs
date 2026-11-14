import type { Metadata } from "next";
import { ProblemLanding } from "@/components/t3-phase3/ProblemLanding";
import pages from "@/components/t3-phase3/problem-pages.json";
import "../t3-rebuild.css";
import "@/components/t3-phase3/phase3-base.css";
import "@/components/t3-phase3/problem-landing.css";

export const metadata: Metadata = {
 title: {absolute: "Roofing Website Not Getting Enquiries? What to Fix | T3Labs"},
 description: "Not getting suitable roofing enquiries? Check visibility, trust and conversions before paying for a rebuild. Real examples and scoped sites from US$299.",
 alternates: { canonical: "https://www.t3labs.tech/roofing-website-design" },
 openGraph: { title: "Roofing Website Not Getting Enquiries? What to Fix | T3Labs", description: "Not getting suitable roofing enquiries? Check visibility, trust and conversions before paying for a rebuild. Real examples and scoped sites from US$299.", url: "https://www.t3labs.tech/roofing-website-design", type: "website" },
};
export default function Page() { return <ProblemLanding page={pages["roofing-website-design"]} />; }
