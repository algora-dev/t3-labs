import type { Metadata } from "next";
import { ProblemLanding } from "@/components/t3-phase3/ProblemLanding";
import pages from "@/components/t3-phase3/problem-pages.json";
import "../t3-rebuild.css";
import "@/components/t3-phase3/phase3-base.css";
import "@/components/t3-phase3/problem-landing.css";

export const metadata: Metadata = {
 title: {absolute: "Roofing Price Estimator for Websites Without Fixed Rates | T3Labs"},
 description: "Give homeowners indicative roof price ranges without publishing fixed rates. See a working roofing estimator and how it turns answers into enquiries.",
 alternates: { canonical: "https://www.t3labs.tech/roofing-website-estimators" },
 openGraph: { title: "Roofing Price Estimator for Websites Without Fixed Rates | T3Labs", description: "Give homeowners indicative roof price ranges without publishing fixed rates. See a working roofing estimator and how it turns answers into enquiries.", url: "https://www.t3labs.tech/roofing-website-estimators", type: "website" },
};
export default function Page() { return <ProblemLanding page={pages["roofing-website-estimators"]} />; }
