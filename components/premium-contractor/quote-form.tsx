"use client";

import { useState } from "react";
import type { PremiumContractorConfig } from "@/types/premium-contractor";
import styles from "./premium-contractor.module.css";

type FormValues = {
  name: string;
  email: string;
  telephone: string;
  location: string;
  service: string;
  propertyType: string;
  description: string;
  timeframe: string;
  contactMethod: string;
  consent: boolean;
};

const initialValues: FormValues = { name: "", email: "", telephone: "", location: "", service: "", propertyType: "", description: "", timeframe: "", contactMethod: "", consent: false };

export function QuoteForm({ site }: { site: PremiumContractorConfig }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const errorSummary = Object.values(errors);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.telephone.trim()) next.telephone = "Enter a telephone number.";
    if (!values.location.trim()) next.location = "Enter the project postcode or location.";
    if (!values.service) next.service = "Choose the closest service.";
    if (!values.propertyType) next.propertyType = "Choose a property type.";
    if (values.description.trim().length < 30) next.description = "Add at least 30 characters about the project.";
    if (!values.timeframe) next.timeframe = "Choose a preferred timeframe.";
    if (!values.contactMethod) next.contactMethod = "Choose a preferred contact method.";
    if (!values.consent) next.consent = "Confirm that you understand this is a demonstration.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      window.setTimeout(() => document.getElementById("quote-errors")?.focus(), 0);
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
    setFileName("");
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <section className={styles.successState} aria-live="polite">
        <span className={styles.successMark} aria-hidden="true">✓</span>
        <p className={styles.eyebrow}>Demonstration complete</p>
        <h2>Your sample enquiry has been captured in this browser.</h2>
        <p>No message, contact details or file has been sent to {site.company.name} or any external service.</p>
        <button type="button" className={styles.primaryButton} onClick={reset}>Return to the form</button>
      </section>
    );
  }

  const fieldError = (key: keyof FormValues) => errors[key] ? <p id={`${key}-error`} className={styles.fieldError}>{errors[key]}</p> : null;

  return (
    <form className={styles.quoteForm} onSubmit={submit} noValidate>
      {errorSummary.length > 0 && (
        <div id="quote-errors" className={styles.errorSummary} role="alert" tabIndex={-1}>
          <strong>Please check {errorSummary.length === 1 ? "one field" : `${errorSummary.length} fields`}.</strong>
          <p>The highlighted items need attention before the demonstration can continue.</p>
        </div>
      )}
      <div className={styles.formSection}>
        <div className={styles.formSectionHeading}><span>01</span><div><h2>Your details</h2><p>How the contractor would contact you about the project.</p></div></div>
        <div className={styles.formGrid}>
          <FormField label="Name" id="name" error={errors.name}><input id="name" name="name" autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{fieldError("name")}</FormField>
          <FormField label="Email" id="email" error={errors.email}><input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => update("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{fieldError("email")}</FormField>
          <FormField label="Telephone" id="telephone" error={errors.telephone}><input id="telephone" name="telephone" type="tel" autoComplete="tel" value={values.telephone} onChange={(e) => update("telephone", e.target.value)} aria-invalid={!!errors.telephone} aria-describedby={errors.telephone ? "telephone-error" : undefined} />{fieldError("telephone")}</FormField>
          <FormField label="Project postcode or location" id="location" error={errors.location}><input id="location" name="location" autoComplete="postal-code" value={values.location} onChange={(e) => update("location", e.target.value)} aria-invalid={!!errors.location} aria-describedby={errors.location ? "location-error" : undefined} />{fieldError("location")}</FormField>
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formSectionHeading}><span>02</span><div><h2>About the project</h2><p>A clear starting point makes the next conversation more useful.</p></div></div>
        <div className={styles.formGrid}>
          <FormField label="Service required" id="service" error={errors.service}><select id="service" name="service" value={values.service} onChange={(e) => update("service", e.target.value)} aria-invalid={!!errors.service} aria-describedby={errors.service ? "service-error" : undefined}><option value="">Select a service</option>{site.services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}<option value="other">Other / not sure</option></select>{fieldError("service")}</FormField>
          <FormField label="Property or client type" id="propertyType" error={errors.propertyType}><select id="propertyType" name="propertyType" value={values.propertyType} onChange={(e) => update("propertyType", e.target.value)} aria-invalid={!!errors.propertyType} aria-describedby={errors.propertyType ? "propertyType-error" : undefined}><option value="">Select a type</option>{site.quote.propertyTypes.map((item) => <option key={item}>{item}</option>)}</select>{fieldError("propertyType")}</FormField>
          <div className={styles.fullField}><FormField label="Project description" id="description" error={errors.description} hint="Include the property, intended work, known problems and any access constraints."><textarea id="description" name="description" rows={7} value={values.description} onChange={(e) => update("description", e.target.value)} aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-error" : "description-hint"} />{fieldError("description")}</FormField></div>
          <FormField label="Preferred timeframe" id="timeframe" error={errors.timeframe}><select id="timeframe" name="timeframe" value={values.timeframe} onChange={(e) => update("timeframe", e.target.value)} aria-invalid={!!errors.timeframe} aria-describedby={errors.timeframe ? "timeframe-error" : undefined}><option value="">Select a timeframe</option>{site.quote.preferredTimeframes.map((item) => <option key={item}>{item}</option>)}</select>{fieldError("timeframe")}</FormField>
          <FormField label="Preferred contact method" id="contactMethod" error={errors.contactMethod}><select id="contactMethod" name="contactMethod" value={values.contactMethod} onChange={(e) => update("contactMethod", e.target.value)} aria-invalid={!!errors.contactMethod} aria-describedby={errors.contactMethod ? "contactMethod-error" : undefined}><option value="">Select a method</option>{site.quote.preferredContactMethods.map((item) => <option key={item}>{item}</option>)}</select>{fieldError("contactMethod")}</FormField>
          <div className={styles.fullField}>
            <label className={styles.uploadField} htmlFor="photos"><span><strong>{fileName || "Add photographs or plans"}</strong><small>{fileName ? "Selected locally — not uploaded" : "JPG, PNG or PDF demonstration control"}</small></span><span className={styles.uploadAction}>{fileName ? "Change file" : "Choose file"}</span></label>
            <input className={styles.visuallyHidden} id="photos" name="photos" type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
          </div>
        </div>
      </div>
      <div className={styles.consentRow}>
        <input id="consent" name="consent" type="checkbox" checked={values.consent} onChange={(e) => update("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined} />
        <div><label htmlFor="consent">{site.quote.consentLabel}</label>{fieldError("consent")}</div>
      </div>
      <div className={styles.formSubmit}><button className={styles.primaryButton} type="submit">Complete demonstration enquiry <span aria-hidden="true">↗</span></button><p>{site.quote.demonstrationNote}</p></div>
    </form>
  );
}

function FormField({ label, id, error, hint, children }: { label: string; id: string; error?: string; hint?: string; children: React.ReactNode }) {
  return <div className={`${styles.formField} ${error ? styles.formFieldInvalid : ""}`}><label htmlFor={id}>{label}<span aria-hidden="true"> *</span></label>{hint && <p id={`${id}-hint`} className={styles.fieldHint}>{hint}</p>}{children}</div>;
}
