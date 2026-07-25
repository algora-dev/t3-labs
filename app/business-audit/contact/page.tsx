import LegalLayout from "../components/LegalLayout";

export const metadata = {
  title: "Contact - Business Audit",
};

export default function ContactPage() {
  return (
    <LegalLayout title="Contact" lastUpdated="14 June 2026">
      <p>
        For questions about the Business Audit tool, your audit report, payment issues, privacy requests, or support, contact us at:
      </p>

      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:hello@t3labs.co.uk">hello@t3labs.co.uk</a>
      </p>

      <p>
        <strong>Business name:</strong> T3 Labs
      </p>

      <p>
        We aim to respond to all enquiries within 2 business days.
      </p>

      <h2>Common enquiries</h2>

      <h3>I paid but have not received my report</h3>
      <p>
        Email us with the email address you used to purchase and we will locate your report or regenerate it. Please allow up to 30 minutes before contacting us as reports can sometimes take a moment to arrive.
      </p>

      <h3>I want to book the free Audit Review Call</h3>
      <p>
        Your Calendly link is included on your report page after payment. If you have lost access to the page, email us and we will send you the link.
      </p>

      <h3>I want a refund</h3>
      <p>
        As stated in our Terms and Conditions, once the digital report has been generated, we may not be able to issue a refund. However, if there was a technical issue or you did not receive your report, we will always aim to resolve this fairly. Email us to discuss.
      </p>

      <h3>Privacy and data requests</h3>
      <p>
        For data access, deletion, or correction requests, email{" "}
        <a href="mailto:hello@t3labs.co.uk">hello@t3labs.co.uk</a> with the subject line "Data Request". See our{" "}
        <a href="/business-audit/privacy">Privacy Policy</a> for full details of your rights.
      </p>
    </LegalLayout>
  );
}
