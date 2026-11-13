/** Public form topics. These values match the approved V18 preview exactly. */
export const REVIEW_TOPICS = [
  { value: "Get better enquiries and more customers", label: "More enquiries", hint: "(better leads)" },
  { value: "Build or improve a website", label: "Website", hint: "(new or improved)" },
  { value: "Get found on Google and AI search", label: "SEO & AI search", hint: "(get found more)" },
  { value: "Quote and estimate faster", label: "Faster quoting", hint: "(save time)" },
  { value: "Cut admin and connect systems", label: "Less admin", hint: "(more time)" },
  { value: "Answer customer questions automatically", label: "Website smart assistant", hint: "(answers 24/7)" },
  { value: "Something custom or not sure yet", label: "Something else / not sure", hint: "" },
] as const;

// Preserve intent from all homepage CTA data-focus values. Each is a label from
// the V18 visual prototype, not the server-side name of the submitted topic.
export const TOPIC_FROM_HOMEPAGE: Record<string, string> = {
  "Build a new website": "Build or improve a website",
  "Improve my existing website": "Build or improve a website",
  "Get found on Google / SEO": "Get found on Google and AI search",
  "Get found in AI search": "Get found on Google and AI search",
  "Get more qualified leads": "Get better enquiries and more customers",
  "Improve enquiry conversion": "Get better enquiries and more customers",
  "Add instant estimates or pricing tools": "Quote and estimate faster",
  "Add a smart website assistant": "Answer customer questions automatically",
  "Measure jobs faster": "Quote and estimate faster",
  "Prepare quotes faster": "Quote and estimate faster",
  "Improve pricing accuracy": "Quote and estimate faster",
  "Improve quote acceptances": "Quote and estimate faster",
  "Reduce admin and data entry": "Cut admin and connect systems",
  "Connect existing software": "Cut admin and connect systems",
};

export const BOOK_CALL_URL = "https://calendly.com/insights-t3labs/20-minute-meeting";

export function resolveTopics(raw: string | undefined) {
  if (!raw) return [];
  const allowed = new Set<string>(REVIEW_TOPICS.map((topic) => topic.value));
  return Array.from(new Set(raw.split("|").map((part) => {
    const value = part.trim();
    return allowed.has(value) ? value : (TOPIC_FROM_HOMEPAGE[value] || "");
  }).filter(Boolean)));
}
