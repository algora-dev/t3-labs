/**
 * T3 Labs AI Intake — Audio container sniffing
 * iOS Safari's MediaRecorder can report an empty or misleading MIME type,
 * and in-app browsers mangle headers. Instead of trusting what the client
 * declares, detect the real container from magic bytes and normalise the
 * upload (correct filename + MIME) before sending to the transcription API.
 */

export type SniffedAudio = {
  extension: string;
  mimeType: string;
};

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

/**
 * Detects the audio container from the first bytes of a recording.
 * Returns null when the container is unrecognised.
 */
export function sniffAudioContainer(bytes: Uint8Array): SniffedAudio | null {
  if (bytes.length < 12) return null;

  const startsWith = (offset: number, sig: string) =>
    sig.split("").every((ch, i) => bytes[offset + i] === ch.charCodeAt(0));

  // RIFF....WAVE
  if (startsWith(0, "RIFF") && startsWith(8, "WAVE")) {
    return { extension: "wav", mimeType: "audio/wav" };
  }

  // OggS (Ogg Vorbis / Opus)
  if (startsWith(0, "OggS")) {
    return { extension: "ogg", mimeType: "audio/ogg" };
  }

  // fLaC
  if (startsWith(0, "fLaC")) {
    return { extension: "flac", mimeType: "audio/flac" };
  }

  // MP3: "ID3" tag header or MPEG frame sync (0xFF Ex)
  if (startsWith(0, "ID3")) {
    return { extension: "mp3", mimeType: "audio/mpeg" };
  }
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) {
    return { extension: "mp3", mimeType: "audio/mpeg" };
  }

  // ISO-BMFF (MP4/M4A): "ftyp" box at offset 4 — covers progressive and
  // fragmented MP4 (what iOS Safari's MediaRecorder emits).
  if (startsWith(4, "ftyp")) {
    return { extension: "mp4", mimeType: "audio/mp4" };
  }

  // EBML (WebM/Matroska)
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return { extension: "webm", mimeType: "audio/webm" };
  }

  return null;
}
