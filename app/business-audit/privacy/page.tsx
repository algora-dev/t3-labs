import LegalLayout from "../components/LegalLayout";

export const metadata = {
  title: "Privacy Policy - Business Audit",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="14 June 2026">
      <h2>1. Who we are</h2>
      <p>
        Business Audit is operated by T3 Labs. We are the data controller for the personal data you provide when using this service.
      </p>
      <p>
        Contact: <a href="mailto:hello@t3labs.co.uk">hello@t3labs.co.uk</a><br />
        Company number: [Not yet registered]<br />
        Registered address: [Not yet registered]
      </p>

      <h2>2. What data we collect</h2>
      <h3>When you complete the free audit</h3>
      <p>
        We collect only the answers you provide in the questionnaire. These answers are used solely to generate your audit result. We do not require you to provide any personal data to receive the free insight.
      </p>
      <p>
        You are asked not to include personal or sensitive information in your answers. If you do include any such information, it may be processed as part of generating your result.
      </p>

      <h3>When you purchase the paid audit report</h3>
      <p>We collect:</p>
      <ul>
        <li>Your first name</li>
        <li>Your email address</li>
        <li>Company name (optional)</li>
        <li>Website URL (optional)</li>
        <li>Your questionnaire answers</li>
        <li>Payment confirmation data from Stripe (we do not store card details)</li>
        <li>Your marketing consent preference</li>
      </ul>

      <h3>Cookies and analytics</h3>
      <p>
        We use essential cookies to operate the site. With your consent, we may use analytics cookies to understand how people use the audit tool. See our{" "}
        <a href="/business-audit/cookies">Cookie Policy</a> for full details.
      </p>

      <h2>3. How we use your data</h2>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Legal basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Generating your audit result (free)</td>
            <td>Legitimate interests</td>
          </tr>
          <tr>
            <td>Processing your payment and generating your paid report</td>
            <td>Contract performance</td>
          </tr>
          <tr>
            <td>Sending your report by email</td>
            <td>Contract performance</td>
          </tr>
          <tr>
            <td>Facilitating the free Audit Review Call (if booked)</td>
            <td>Contract performance / legitimate interests</td>
          </tr>
          <tr>
            <td>Sending marketing emails (if you opted in)</td>
            <td>Consent</td>
          </tr>
          <tr>
            <td>Improving the audit tool</td>
            <td>Legitimate interests</td>
          </tr>
          <tr>
            <td>Legal compliance</td>
            <td>Legal obligation</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Who we share your data with</h2>
      <p>We use the following third-party processors:</p>
      <ul>
        <li><strong>Stripe</strong> - payment processing (UK/EU data processing agreement in place)</li>
        <li><strong>Anthropic</strong> - AI report generation (your answers are sent to Anthropic's API to generate your result)</li>
        <li><strong>Supabase</strong> - secure data storage</li>
        <li><strong>Vercel</strong> - website hosting</li>
        <li><strong>Calendly</strong> - call booking (if you choose to book a review call; Calendly's own privacy policy applies)</li>
      </ul>
      <p>
        We do not sell your personal data. We do not share it with any third party for their own marketing purposes.
      </p>

      <h2>5. Data retention</h2>
      <p>
        Questionnaire answers and audit results are retained for up to 2 years to support disputes, refund requests, and service improvement. If you request deletion, we will remove your data within 30 days except where we are required to retain it by law.
      </p>

      <h2>6. Your rights</h2>
      <p>Under UK GDPR, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Correct inaccurate data</li>
        <li>Request erasure of your data</li>
        <li>Restrict or object to processing</li>
        <li>Data portability</li>
        <li>Withdraw consent at any time (where processing is based on consent)</li>
      </ul>
      <p>
        To exercise any of these rights, email us at{" "}
        <a href="mailto:hello@t3labs.co.uk">hello@t3labs.co.uk</a>. We will respond within 30 days.
      </p>
      <p>
        If you are not satisfied with our response, you have the right to complain to the Information Commissioner's Office (ICO) at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
      </p>

      <h2>7. International transfers</h2>
      <p>
        Some of our third-party processors (including Anthropic) are based outside the UK and EEA. Where data is transferred internationally, we ensure appropriate safeguards are in place, including standard contractual clauses where required.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The current version will always be available at this URL. The date at the top of this page shows when it was last updated.
      </p>

      <h2>9. Contact</h2>
      <p>
        For any privacy queries, email us at{" "}
        <a href="mailto:hello@t3labs.co.uk">hello@t3labs.co.uk</a>.
      </p>
    </LegalLayout>
  );
}
