import type { Metadata } from "next";
import { ProblemLanding } from "@/components/t3-phase3/ProblemLanding";
import pages from "@/components/t3-phase3/problem-pages.json";
import "../t3-rebuild.css";
import "@/components/t3-phase3/phase3-base.css";
import "@/components/t3-phase3/problem-landing.css";

export const metadata: Metadata = {
 title: {absolute: "Roofing Business Automation to Reduce Admin | T3Labs"},
 description: "Stop retyping roofing job details and chasing the same tasks. Learn where a small workflow, integration or reminder can save time.",
 alternates: { canonical: "https://www.t3labs.tech/roofing-business-automation" },
 openGraph: { title: "Roofing Business Automation to Reduce Admin | T3Labs", description: "Stop retyping roofing job details and chasing the same tasks. Learn where a small workflow, integration or reminder can save time.", url: "https://www.t3labs.tech/roofing-business-automation", type: "website" },
};
export default function Page() { return <ProblemLanding page={pages["roofing-business-automation"]} />; }
