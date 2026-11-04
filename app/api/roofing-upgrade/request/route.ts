import { NextRequest, NextResponse } from "next/server";
import cohortConfig from "@/config/roofing-upgrade-cohort.json";

export const runtime = "nodejs";

const COHORT_ID = cohortConfig.cohortId;
const NOTIFY_EMAIL = process.env.ROOFING_UPGRADE_NOTIFY_EMAIL || process.env.CONTACT_EMAIL || "insights@t3labs.tech";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "T3 Labs <insights@t3labs.co.uk>";

function str(value: unknown, length = 500): string {
  return typeof value === "string" ? value.trim().slice(0, length) : "";
}
function arr(value: unknown, max = 20): string[] {
  return Array.isArray(value) ? value.slice(0, max).map(item => str(item, 140)).filter(Boolean) : [];
}
function escaped(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function websiteUrl(input: string): string {
  if (!input) return "";
  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(candidate);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) return "";
    return url.toString().slice(0, 600);
  } catch { return ""; }
}
function formatRows(values: Array<[string,string]>) {
  return values.filter(([, v]) => v).map(([label, value]) =>
    `<tr><td style="padding:7px 12px 7px 0;color:#657080;vertical-align:top;width:170px">${escaped(label)}</td><td style="padding:7px 0;color:#101318;white-space:pre-wrap">${escaped(value)}</td></tr>`
  ).join("");
}
const HEADERS = { "Cache-Control": "no-store" };
export async function POST(req: NextRequest) {
  const dbUrl = process.env.SUPABASE_URL;
  const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  // Deliberately fail closed: no false thank-you page, no silent loss of inquiries.
  if (!dbUrl || !dbKey || !resendKey) {
    return NextResponse.json({ ok:false, error:"Requests are temporarily unavailable. Please book a call or try again shortly." }, {status:503, headers:HEADERS});
  }
  try {
    const raw = await req.text();
    if (raw.length > 16000) return NextResponse.json({ok:false,error:"Please shorten your notes."},{status:413, headers:HEADERS});
    const body = JSON.parse(raw);
    // Hidden honeypot. A filled field is not a valid request.
    if (str(body?.companyFax)) return NextResponse.json({ok:true}, {headers:HEADERS});
    const email = str(body?.email,254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ok:false,error:"Please enter a valid email address."},{status:400,headers:HEADERS});
    }
    const plan = str(body?.plan,24);
    if (!["essential","growth","complete","unsure"].includes(plan)) {
      return NextResponse.json({ok:false,error:"Please select a package."},{status:400,headers:HEADERS});
    }
    const improvements = arr(body?.improvements);
    const marketing = arr(body?.marketing);
    const teamSize = str(body?.teamSize,80);
    const quoteProcess = str(body?.quoteProcess,120);
    const preferredFormat = str(body?.preferredFormat,120);
    if (!improvements.length || !marketing.length || !teamSize || !preferredFormat) {
      return NextResponse.json({ok:false,error:"Please complete the short questions first."},{status:400,headers:HEADERS});
    }
    if ((plan === "growth" || plan === "complete" || improvements.includes("faster-quoting")) && !quoteProcess) {
      return NextResponse.json({ok:false,error:"Please select how you currently quote jobs."},{status:400,headers:HEADERS});
    }
    const rawSite = str(body?.website,500);
    const website = websiteUrl(rawSite);
    if (rawSite && !website) return NextResponse.json({ok:false,error:"Please enter a valid website or leave it blank."},{status:400,headers:HEADERS});
    const country = str(body?.country,120);
    const notes = str(body?.notes,2000);
    const requestId = str(body?.submissionId,80) || crypto.randomUUID();
    if (!/^[a-zA-Z0-9-]{15,80}$/.test(requestId)) {
      return NextResponse.json({ok:false,error:"Please refresh and try again."},{status:400,headers:HEADERS});
    }
    const attribution = {
      utm_source:str(body?.utmSource,150),utm_medium:str(body?.utmMedium,150),
      utm_campaign:str(body?.utmCampaign,200),utm_content:str(body?.utmContent,200),
      page_url:str(body?.pageUrl,900),referrer:str(body?.referrer,900),
    };
    const cohortEndpoint = new URL("/rest/v1/roofing_upgrade_cohorts", dbUrl);
    cohortEndpoint.searchParams.set("id",`eq.${COHORT_ID}`);
    cohortEndpoint.searchParams.set("select","id,capacity,confirmed_count,status,pricing_phase");
    const auth = { apikey:dbKey, Authorization:`Bearer ${dbKey}` };
    const cohortRes = await fetch(cohortEndpoint,{headers:auth,cache:"no-store",signal:AbortSignal.timeout(9000)});
    if(!cohortRes.ok)throw new Error(`Cohort read failed (${cohortRes.status})`);
    const cohort = (await cohortRes.json())[0] as {id:string;capacity:number;confirmed_count:number;status:string;pricing_phase:string}|undefined;
    if (!cohort || cohort.status!=="open" || cohortConfig.spotsAvailable <= 0) {
      return NextResponse.json({ok:false,error:"This cohort is currently full. Please contact Shaun about the next available place."},{status:409,headers:HEADERS});
    }
    // POSTGREST insert with duplicate-ignore: retries never reset a previously reviewed/accepted request.
    const url = new URL("/rest/v1/roofing_upgrade_requests",dbUrl);
    url.searchParams.set("on_conflict","id");
    const insert = await fetch(url,{
      method:"POST",
      headers:{...auth,"Content-Type":"application/json",Prefer:"resolution=ignore-duplicates,return=minimal"},
      body:JSON.stringify({
        id:requestId,cohort_id:COHORT_ID,plan,email,website:website||null,
        country:country||null,improvements,marketing,team_size:teamSize,
        quote_process:quoteProcess||null,preferred_format:preferredFormat,
        notes:notes||null,attribution,status:"requested",
      }),signal:AbortSignal.timeout(9000),
    });
    if (!insert.ok) {
      console.error("Roofing upgrade request storage failed:",insert.status,await insert.text());
      throw new Error("Request could not be saved");
    }
    const rows: Array<[string,string]> = [
      ["Cohort",COHORT_ID],["Preferred package",plan],["Reply email",email],
      ["Website",website],["Country / time zone",country],["Wants to improve",improvements.join(", ")],
      ["Current inquiry sources",marketing.join(", ")],["Team size",teamSize],
      ["Measuring / quoting",quoteProcess],["Working preference",preferredFormat],
      ["Additional details",notes],["Campaign source",attribution.utm_source],
      ["Campaign medium",attribution.utm_medium],["Campaign name",attribution.utm_campaign],
      ["Campaign content",attribution.utm_content],["Landing page",attribution.page_url],
      ["Referrer",attribution.referrer],["Request ID",requestId],
    ];
    const html = `<html><body style="margin:0;padding:24px;background:#f6f8fc;font-family:Arial,sans-serif;color:#0a0b10"><div style="max-width:690px;margin:0 auto;padding:25px;background:#fff;border:1px solid #e7e9ef;border-radius:16px"><div style="height:6px;background:#d7ff00;margin:-25px -25px 24px"></div><p style="color:#5f7000;font-size:12px;font-weight:bold;letter-spacing:.1em">10-DAY ROOFING BUSINESS UPGRADE</p><h1 style="font-size:27px;margin:8px 0 12px">New ${escaped(plan)} request</h1><p style="color:#606575;line-height:1.5">Review personally. This is a request only, not a confirmed booking or payment. Confirm package scope, availability and pricing before sending payment instructions.</p><table style="font-size:14px;width:100%;line-height:1.6">${formatRows(rows)}</table></div></body></html>`;
    const emailRes = await fetch("https://api.resend.com/emails",{
      method:"POST",headers:{Authorization:`Bearer ${resendKey}`,"Content-Type":"application/json"},
      body:JSON.stringify({from:FROM_EMAIL,to:[NOTIFY_EMAIL],reply_to:email,
        subject:`Roofing upgrade request · ${plan.toUpperCase()} · ${email}`,html}),
      signal:AbortSignal.timeout(12000),
    });
    if (!emailRes.ok) {
      console.error("Roofing upgrade email delivery failed:",emailRes.status,await emailRes.text());
      return NextResponse.json({ok:false,error:"Your request was saved, but the notification could not be sent. Please try again or book a call."},{status:502,headers:HEADERS});
    }
    return NextResponse.json({ok:true},{headers:HEADERS});
  } catch (error) {
    console.error("Roofing upgrade request failed:",error);
    return NextResponse.json({ok:false,error:"We couldn't send your request right now. Please try again shortly or book a call."},{status:500,headers:HEADERS});
  }
}
