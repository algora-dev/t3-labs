import Link from "next/link";

const outcomes = [
  {
    number: "01",
    title: "Get found",
    tagline: "Bring the right roofing customers to your website.",
    problem: "More traffic is not the goal. You need people looking for roofing jobs you want, in places you serve.",
    solution: "We improve how the right customers find you through local search, service-area pages and clear messaging about the work you want.",
    gain: "More website enquiries from people looking for the roofing work you actually want.",
    actions: ["Local search and service-area visibility", "Clear messaging for your best-fit work", "Landing pages built for genuine roofing intent"],
    href: "/roofing-seo",
    link: "How we help you get found",
  },
  {
    number: "02",
    title: "Convert",
    tagline: "Turn more website enquiries into jobs worth quoting.",
    problem: "Not every enquiry gives you enough information to quote. Customers can lose interest when the next step is unclear.",
    solution: "We make it easier to enquire, ask the right project questions and guide customers from first contact to a useful quoting conversation.",
    gain: "More of your website enquiries become genuine, quote-ready opportunities – with the details you need to respond.",
    actions: ["Clear calls to action and trust signals", "Useful website estimators and assistants", "Better enquiry forms and project information"],
    href: "/roofing-website-estimators",
    link: "Explore website estimators",
  },
  {
    number: "03",
    title: "Quote faster",
    tagline: "Get professional quotes out with less admin.",
    problem: "Whether you quote on paper, in spreadsheets or with software, unnecessary steps slow down your response and eat into your day.",
    solution: "We review how you quote today, remove repetitive steps and improve or connect the tools you already use – or build a simpler workflow where needed.",
    gain: "Less time measuring, pricing and preparing quotes. Send clearer, professional quotes sooner, with fewer steps.",
    actions: ["Streamlined measuring and takeoff", "Connected pricing and quote templates", "Fewer repetitive steps and data transfers"],
    href: "/roofing-quoting-software",
    link: "See quoting solutions",
  },
  {
    number: "04",
    title: "Win more",
    tagline: "Follow up consistently and convert more quotes.",
    problem: "Great opportunities go cold when quotes are slow, difficult to understand or never followed up.",
    solution: "We help you present quotes clearly, keep track of opportunities and make follow-up easier, without adding another admin burden.",
    gain: "Fewer opportunities slipping away, better follow-up and a stronger chance of winning profitable roofing jobs.",
    actions: ["Clearer quote presentation and next steps", "Follow-up reminders and useful automation", "Visibility into quote status and outcomes"],
    href: "/free-review?focus=Improve+quote+follow-up+and+win+rate",
    link: "Talk about winning more jobs",
  },
];

export function GrowthJourney() {
  return (
    <section className="section t3-growth-outcomes" id="outcomes" aria-labelledby="t3-growth-heading">
      <div className="container">
        <div className="t3-growth-intro">
          <div className="eyebrow">THE FOUR OUTCOMES THAT MATTER</div>
          <h2 id="t3-growth-heading">From first click to <span className="t3-growth-highlight">signed job.</span></h2>
          <p>We focus on the moments where you lose good customers, valuable hours or profitable work. Explore each stage to see what could improve.</p>
        </div>
        <div className="t3-outcomes-list">
          {outcomes.map((item) => (
            <details className="t3-outcome" key={item.number}>
              <summary>
                <span className="t3-outcome-number">{item.number}</span>
                <span className="t3-outcome-label"><strong>{item.title}</strong><span>{item.tagline}</span></span>
                <span className="t3-outcome-action"><span className="t3-outcome-see">See how</span><span className="t3-outcome-plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" focusable="false"><path d="M12 5v14M5 12h14" /></svg></span></span>
              </summary>
              <div className="t3-outcome-expanded">
                <div className="t3-outcome-explanation"><div className="t3-outcome-eyebrow">THE PROBLEM</div><p>{item.problem}</p><div className="t3-outcome-eyebrow">HOW WE HELP</div><p>{item.solution}</p></div>
                <div className="t3-outcome-expanded-side"><strong>In practice</strong><ul>{item.actions.map((action) => <li key={action}>{action}</li>)}</ul><Link href={item.href}>{item.link} ↗</Link></div>
                <div className="t3-outcome-gain"><span className="t3-outcome-gain-label">WHAT YOU GAIN</span><strong>{item.gain}</strong></div>
              </div>
            </details>
          ))}
        </div>
        <div className="t3-outcomes-end"><span>You don’t need to improve everything to make a big difference. We’ll help you find the right place to start.</span><a href="#growth-calculator">Explore your potential ↗</a><Link href="/solutions">Explore all roofing solutions ↗</Link></div>
      </div>
    </section>
  );
}
