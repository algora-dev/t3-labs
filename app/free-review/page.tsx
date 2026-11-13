import type { Metadata } from "next";
import { FreeReview } from "@/components/t3-rebuild/FreeReview";
import { resolveTopics } from "@/components/t3-rebuild/review-topics";
import "../t3-rebuild.css";

export const metadata: Metadata = {
  title: "Free Business Review for Roofing & Construction | T3Labs",
  description: "Tell T3Labs what you want to improve. Send a quick enquiry or book a 20-minute call with our team.",
  alternates: { canonical: "/free-review" },
};

type Search = { focus?: string | string[]; package?: string | string[] };

export default async function FreeReviewPage({ searchParams }: { searchParams: Promise<Search> }) {
  const query = await searchParams;
  const focus = typeof query?.focus === "string" ? query.focus : "";
  const packageInterest = typeof query?.package === "string" ? query.package.slice(0, 160) : "";
  return (
    <div className="t3-rebuild">
      <FreeReview initialTopics={resolveTopics(focus)} packageInterest={packageInterest} />
    </div>
  );
}
