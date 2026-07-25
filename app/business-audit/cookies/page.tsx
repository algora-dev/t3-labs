import LegalLayout from "../components/LegalLayout";

export const metadata = {
  title: "Cookie Policy - Business Audit",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="14 June 2026">
      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the site work correctly and allow us to understand how visitors use the service.
      </p>

      <h2>What cookies we use</h2>

      <h3>Strictly necessary cookies</h3>
      <p>
        These cookies are essential for the site to function. They cannot be turned off. They do not store any personally identifiable information.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>cookie_consent</td>
            <td>Stores your cookie preference so we do not ask again</td>
            <td>1 year</td>
          </tr>
        </tbody>
      </table>

      <h3>Analytics cookies</h3>
      <p>
        These cookies help us understand how people use the audit tool so we can improve it. They are only set with your consent.
      </p>
      <p>
        We may use third-party analytics tools. No analytics cookies are currently active by default.
      </p>

      <h3>Performance and session recording cookies</h3>
      <p>
        These cookies may be used to record anonymised sessions to identify usability issues. They are only set with your consent and are not currently active by default.
      </p>

      <h3>Marketing cookies</h3>
      <p>
        These cookies may be used to measure the effectiveness of marketing campaigns. They are only set with your consent and are not currently active by default.
      </p>

      <h2>Managing your preferences</h2>
      <p>
        You can accept all cookies, reject non-essential cookies, or manage your preferences at any time using the cookie banner or the{" "}
        <a href="/business-audit/cookie-preferences">Cookie Preferences</a> page.
      </p>
      <p>
        You can also control cookies through your browser settings. Note that blocking all cookies may affect how the site works.
      </p>

      <h2>Third-party cookies</h2>
      <p>
        If you choose to book a free Audit Review Call, Calendly may set its own cookies on your device. These are governed by{" "}
        <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer">Calendly's privacy policy</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the tools we use change. The current version will always be available at this URL.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about our use of cookies, email{" "}
        <a href="mailto:hello@t3labs.co.uk">hello@t3labs.co.uk</a>.
      </p>
    </LegalLayout>
  );
}
