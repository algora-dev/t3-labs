/**
 * T3 Labs AI Intake — Audio helpers
 * Maps browser recording MIME types to file extensions so uploads to the
 * transcription API carry the correct filename/format (OpenAI rejects
 * files whose extension doesn't match their container format).
 */

const AUDIO_EXTENSIONS: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
};

/** Returns a sane file extension for a MIME type (defaults to webm). */
export function audioExtensionForMime(mime: string): string {
  const base = (mime || "").split(";")[0].trim().toLowerCase();
  return AUDIO_EXTENSIONS[base] ?? "webm";
}
