"use client";

import { FormEvent, useState } from "react";

export function RequestPriceForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (sent) {
    return (
      <div className="legacy-form-success">
        <span className="success-tick">✓</span>
        <h1>Thanks for your enquiry</h1>
        <p>A member of the Apex Roofing team will review your details and get back to you.</p>
        <p className="response-note">Typical response time: 1-2 working days.</p>
      </div>
    );
  }

  return (
    <form className="legacy-long-form" onSubmit={handleSubmit}>
      <section className="form-section">
        <div className="form-section-heading"><span>1</span><div><h2>Your enquiry</h2><p>Complete the fields below and we will get back to you.</p></div></div>
        <div className="form-grid two-col">
          <label>Full name *<input required /></label>
          <label>Email address *<input type="email" required /></label>
          <label>Phone number *<input type="tel" required /></label>
          <label>Postcode *<input required /></label>
          <label className="full-field">Nature of enquiry *<select defaultValue=""><option value="" disabled>Select one</option><option>Request a price / quotation</option><option>New roof</option><option>Re-roof / replacement</option><option>Roof repair</option><option>Product information</option><option>Other</option></select></label>
        </div>
        <label className="full-field">Your message<textarea rows={6} placeholder="Tell us briefly what you need..." /></label>
      </section>

      <div className="form-submit-zone">
        <p><strong>Please note:</strong> Prices cannot be confirmed from this form. A member of our team may need to contact you for further information.</p>
        <label className="consent-row"><input type="checkbox" required /> I agree that Apex Roofing may contact me about this enquiry.</label>
        <button type="submit" className="legacy-btn legacy-submit">Submit Enquiry</button>
        <small>We aim to respond within 1-2 working days.</small>
      </div>
    </form>
  );
}
