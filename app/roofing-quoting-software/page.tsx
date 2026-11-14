import type { Metadata } from "next";
import { ProblemLanding } from "@/components/t3-phase3/ProblemLanding";
import pages from "@/components/t3-phase3/problem-pages.json";
import "../t3-rebuild.css";
import "@/components/t3-phase3/phase3-base.css";
import "@/components/t3-phase3/problem-landing.css";

export const metadata: Metadata = {
 title: {absolute: "Custom Roofing Quoting and Estimating Tools | T3Labs"},
 description: "Quote roofing jobs faster with a spreadsheet improvement, focused calculator or tailored software. See real QuoteCore+ capability and simpler alternatives.",
 alternates: { canonical: "https://www.t3labs.tech/roofing-quoting-software" },
 openGraph: { title: "Custom Roofing Quoting and Estimating Tools | T3Labs", description: "Quote roofing jobs faster with a spreadsheet improvement, focused calculator or tailored software. See real QuoteCore+ capability and simpler alternatives.", url: "https://www.t3labs.tech/roofing-quoting-software", type: "website" },
};
export default function Page() { return <ProblemLanding page={pages["roofing-quoting-software"]} />; }
