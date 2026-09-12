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
        <div className="form-section-heading"><span>1</span><div><h2>Your details</h2><p>Tell us how we can contact you.</p></div></div>
        <div className="form-grid two-col">
          <label>First name *<input required /></label>
          <label>Last name *<input required /></label>
          <label>Email address *<input type="email" required /></label>
          <label>Phone number *<input type="tel" required /></label>
          <label>Preferred contact method<select defaultValue=""><option value="" disabled>Select one</option><option>Phone</option><option>Email</option><option>Either</option></select></label>
          <label>Best time to contact<select defaultValue=""><option value="" disabled>Select one</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>2</span><div><h2>Property details</h2><p>We need a few details about the property.</p></div></div>
        <div className="form-grid two-col">
          <label>Property address line 1 *<input required /></label>
          <label>Address line 2<input /></label>
          <label>Town / city *<input defaultValue="Leeds" required /></label>
          <label>Postcode *<input required /></label>
          <label>Property type *<select defaultValue=""><option value="" disabled>Select property type</option><option>Detached house</option><option>Semi-detached house</option><option>Terraced house</option><option>Bungalow</option><option>Commercial property</option><option>Other</option></select></label>
          <label>Approximate property age<select defaultValue=""><option value="" disabled>Select age</option><option>Pre-1900</option><option>1900-1949</option><option>1950-1979</option><option>1980-1999</option><option>2000-present</option><option>Not sure</option></select></label>
          <label>Number of storeys<select defaultValue=""><option value="" disabled>Select</option><option>1</option><option>2</option><option>3+</option><option>Not sure</option></select></label>
          <label>Is there vehicle access?<select defaultValue=""><option value="" disabled>Select</option><option>Yes</option><option>No</option><option>Limited</option><option>Not sure</option></select></label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>3</span><div><h2>Roofing requirement</h2><p>Provide as much information as you can.</p></div></div>
        <div className="form-grid two-col">
          <label>What do you need? *<select defaultValue="Clay tile pricing / roof project"><option>Clay tile pricing / roof project</option><option>New roof</option><option>Re-roof / replacement</option><option>Roof repair</option><option>Roof inspection</option><option>Other</option></select></label>
          <label>Preferred roofing material<select defaultValue="Heritage clay pantile"><option>Heritage clay pantile</option><option>Clay plain tile</option><option>Concrete tile</option><option>Natural slate</option><option>Not sure</option></select></label>
          <label>Approximate roof size<select defaultValue=""><option value="" disabled>Select</option><option>Under 75m²</option><option>75-150m²</option><option>150-250m²</option><option>250m²+</option><option>Not sure</option></select></label>
          <label>Approximate roof pitch<select defaultValue=""><option value="" disabled>Select</option><option>Low</option><option>Medium</option><option>Steep</option><option>Not sure</option></select></label>
          <label>Existing roof covering<select defaultValue=""><option value="" disabled>Select</option><option>Clay tile</option><option>Concrete tile</option><option>Slate</option><option>Flat roof membrane</option><option>Other</option><option>Not sure</option></select></label>
          <label>When are you looking to start?<select defaultValue=""><option value="" disabled>Select timeframe</option><option>As soon as possible</option><option>Within 1 month</option><option>1-3 months</option><option>3-6 months</option><option>Just researching</option></select></label>
        </div>

        <fieldset className="checkbox-fieldset">
          <legend>Which items may also be required?</legend>
          <div className="checkbox-grid">
            {[
              "Ridge tiles",
              "Hip tiles",
              "Valleys",
              "Lead flashing",
              "Dry verge",
              "Guttering",
              "Fascia / soffit",
              "Insulation",
              "Roof ventilation",
              "Chimney work",
              "Not sure",
            ].map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
          </div>
        </fieldset>

        <label className="full-field">Describe the work you need *<textarea required rows={7} placeholder="Please tell us what work is required, any known measurements, the condition of the existing roof, access details and anything else that may help us provide a price..." /></label>
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>4</span><div><h2>Photos, plans & supporting information</h2><p>Optional, but may help us understand the work.</p></div></div>
        <label className="file-drop">Upload files<input type="file" multiple /><span>Choose files or drag them here</span><small>Photos, plans or documents. Maximum 10MB per file.</small></label>
        <div className="form-grid two-col">
          <label>Do you have architectural drawings?<select defaultValue=""><option value="" disabled>Select</option><option>Yes</option><option>No</option><option>Not sure</option></select></label>
          <label>Do you know the roof measurements?<select defaultValue=""><option value="" disabled>Select</option><option>Yes</option><option>No</option><option>Some measurements</option></select></label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>5</span><div><h2>Final details</h2><p>A few final questions before you send the enquiry.</p></div></div>
        <div className="form-grid two-col">
          <label>How did you hear about Apex?<select defaultValue=""><option value="" disabled>Select one</option><option>Google</option><option>Facebook / Instagram</option><option>Recommendation</option><option>Previous customer</option><option>Other</option></select></label>
          <label>Preferred appointment day<select defaultValue=""><option value="" disabled>Select one</option><option>Monday-Friday</option><option>Saturday</option><option>Any day</option></select></label>
        </div>
        <label className="consent-row"><input type="checkbox" required /> I confirm the information provided is accurate to the best of my knowledge and agree that Apex Roofing may contact me about this enquiry.</label>
        <label className="consent-row"><input type="checkbox" /> I would also like to receive occasional news, offers and roofing advice.</label>
      </section>

      <div className="form-submit-zone">
        <p><strong>Before submitting:</strong> Prices cannot be confirmed from this form. A member of our team may need to contact you for further information or arrange a site visit.</p>
        <button type="submit" className="legacy-btn legacy-submit">Submit Roofing Enquiry</button>
        <small>We aim to respond within 1-2 working days.</small>
      </div>
    </form>
  );
}
