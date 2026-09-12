// Full-document response: no parent layout, relative assets or React HTML injection.
import { searchDocument, recordingCsp } from "../_recording/scenes.generated";

export function GET(): Response {
  return new Response(searchDocument, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": recordingCsp,
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  });
}
