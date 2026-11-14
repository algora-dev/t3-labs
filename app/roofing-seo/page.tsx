import type { Metadata } from "next";
import { ProblemLanding } from "@/components/t3-phase3/ProblemLanding";
import pages from "@/components/t3-phase3/problem-pages.json";
import "../t3-rebuild.css";
import "@/components/t3-phase3/phase3-base.css";
import "@/components/t3-phase3/problem-landing.css";

export const metadata: Metadata = {
 title: {absolute: "How to Get Better Roofing Leads, Not Just More | T3Labs"},
 description: "Getting bad or unsuitable roofing leads? Learn whether visibility, targeting or website conversion is holding you back and what to fix first.",
 alternates: { canonical: "https://www.t3labs.tech/roofing-seo" },
 openGraph: { title: "How to Get Better Roofing Leads, Not Just More | T3Labs", description: "Getting bad or unsuitable roofing leads? Learn whether visibility, targeting or website conversion is holding you back and what to fix first.", url: "https://www.t3labs.tech/roofing-seo", type: "website" },
};
export default function Page() { return <ProblemLanding page={pages["roofing-seo"]} />; }
