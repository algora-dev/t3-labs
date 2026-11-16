import { ProblemLanding } from "@/components/t3-phase3/ProblemLanding";
import { roofingServiceMetadata } from "@/lib/roofing-service-seo";
import pages from "@/components/t3-phase3/problem-pages.json";
import "../t3-rebuild.css";
import "@/components/t3-phase3/phase3-base.css";
import "@/components/t3-phase3/problem-landing.css";

export const metadata = roofingServiceMetadata("roofing-website-estimators");
export default function Page() { return <ProblemLanding page={pages["roofing-website-estimators"]} />; }
