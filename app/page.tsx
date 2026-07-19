import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

function getHomepageBody() {
  const html = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? "";
  return body.replace(/<script[\s\S]*?<\/script>/gi, "");
}

export default function Home() {
  return (
    <>
      {/* The legacy homepage CSS is page-scoped here so it does not leak into proposal pages. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/styles.css?v=20260719-typography-live" />
      <div dangerouslySetInnerHTML={{ __html: getHomepageBody() }} />
      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}
