import type { Metadata } from "next";
import { ProblemLanding } from "@/components/t3-phase3/ProblemLanding";
import pages from "@/components/t3-phase3/problem-pages.json";
import "../t3-rebuild.css";
import "@/components/t3-phase3/phase3-base.css";
import "@/components/t3-phase3/problem-landing.css";

export const metadata: Metadata = {
 title: {absolute: "Roofing Website AI Assistant That Answers Customers | T3Labs"},
 description: "Give roofing website visitors immediate approved answers and hand off to your team when needed. See a real assistant example and decide what to automate.",
 alternates: { canonical: "https://www.t3labs.tech/roofing-ai-website-assistants" },
 openGraph: { title: "Roofing Website AI Assistant That Answers Customers | T3Labs", description: "Give roofing website visitors immediate approved answers and hand off to your team when needed. See a real assistant example and decide what to automate.", url: "https://www.t3labs.tech/roofing-ai-website-assistants", type: "website" },
};
export default function Page() { return <ProblemLanding page={pages["roofing-ai-website-assistants"]} />; }
