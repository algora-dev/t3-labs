"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import type {
  IntakeStage,
  AnalysisResponse,
  FinalBrief,
  ContactDetails,
  IntakeMessage,
} from "@/lib/intake/types";
import { SERVICE_LABELS } from "@/lib/intake/types";

/* ------------------------------------------------------------------ */
/*  IntakeModal — main component                                      */
/* ------------------------------------------------------------------ */

interface IntakeModalProps {
  open: boolean;
  onClose: () => void;
}

type AnalyseApiResponse = AnalysisResponse & { stage: IntakeStage };
type RecordingTarget = "intro" | "follow_up" | "final_question";

async function readApiResponse<T>(response: Response, fallbackError: string): Promise<T> {
  const rawBody = await response.text();
  let data: unknown = null;

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      if (response.ok) {
        throw new Error("The server returned an unreadable response. Please try again.");
      }
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
        ? data.error
        : fallbackError;
    throw new Error(message);
  }

  if (data === null) {
    throw new Error("The server returned an empty response. Please try again.");
  }

  return data as T;
}

export default function IntakeModal({ open, onClose }: IntakeModalProps) {
  const [stage, setStage] = useState<IntakeStage>("intro");
  const [textInput, setTextInput] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [brief, setBrief] = useState<FinalBrief | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [contact, setContact] = useState<ContactDetails>({
    name: "",
    email: "",
    company: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<IntakeMessage[]>([]);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLTextAreaElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTargetRef = useRef<RecordingTarget>("intro");
  const recordingCancelledRef = useRef(false);

  // Close handler — defined early so it can be used in effects
  const handleClose = useCallback(() => {
    // Never clear user input on close
    onClose();
  }, [onClose]);

  // Focus trap + Escape + scroll lock
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, handleClose]);

  // Auto-focus text input on intro stage
  useEffect(() => {
    if (open && stage === "intro" && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open, stage]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const reset = useCallback(() => {
    setStage("intro");
    setTextInput("");
    setAnalysis(null);
    setBrief(null);
    setFollowUpAnswer("");
    setFinalAnswer("");
    setError(null);
    setTranscript("");
    setContact({ name: "", email: "", company: "", phone: "" });
    setMessages([]);
  }, []);

  // ── API handlers ──────────────────────────────────────────────────

  const handleInitialSubmit = useCallback(async () => {
    if (textInput.trim().length < 20) return;
    setStage("initial_processing");
    setError(null);

    const visitorMessage: IntakeMessage = {
      role: "visitor",
      content: textInput.trim(),
      timestamp: new Date().toISOString(),
      input_type: transcript ? "voice" : "text",
    };

    const updatedMessages = [...messages, visitorMessage];

    try {
      const res = await fetch("/api/intake/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          turn_number: 1,
        }),
      });

      const data = await readApiResponse<AnalyseApiResponse>(
        res,
        "Something went wrong while processing that. Please try again.",
      );
      setAnalysis(data);

      // Store assistant response in messages
      const assistantMessage: IntakeMessage = {
        role: "assistant",
        content: JSON.stringify(data),
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, assistantMessage]);

      if (data.status === "READY_FOR_BRIEF" || data.status === "OUT_OF_SCOPE") {
        // Generate the final brief
        const briefRes = await fetch("/api/intake/finalise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...updatedMessages, assistantMessage] }),
        });
        const briefData = await readApiResponse<FinalBrief>(
          briefRes,
          "Something went wrong while creating your brief. Please try again.",
        );
        setBrief(briefData);
        setStage("brief");
      } else {
        setStage("follow_up");
      }
      setFollowUpAnswer("");
    } catch (err) {
      setError((err as Error).message || "Something went wrong while processing that. Your message is still here - please try again.");
      setStage("intro");
    }
  }, [textInput, messages, transcript]);

  const handleFollowUpSubmit = useCallback(async () => {
    if (followUpAnswer.trim().length < 5) return;
    setStage("follow_up_processing");
    setError(null);

    const visitorMessage: IntakeMessage = {
      role: "visitor",
      content: followUpAnswer.trim(),
      timestamp: new Date().toISOString(),
      input_type: "text",
    };

    const updatedMessages = [...messages, visitorMessage];

    try {
      const res = await fetch("/api/intake/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          turn_number: 2,
        }),
      });

      const data = await readApiResponse<AnalyseApiResponse>(
        res,
        "Something went wrong while processing that. Please try again.",
      );

      const assistantMessage: IntakeMessage = {
        role: "assistant",
        content: JSON.stringify(data),
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, assistantMessage]);

      if (data.status === "READY_FOR_BRIEF" || data.status === "OUT_OF_SCOPE") {
        const briefRes = await fetch("/api/intake/finalise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...updatedMessages, assistantMessage] }),
        });
        const briefData = await readApiResponse<FinalBrief>(
          briefRes,
          "Something went wrong while creating your brief. Please try again.",
        );
        setBrief(briefData);
        setStage("brief");
      } else if (data.follow_up_question) {
        // Need a third question
        setAnalysis(data);
        setStage("final_question");
      } else {
        // Go to brief
        const briefRes = await fetch("/api/intake/finalise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...updatedMessages, assistantMessage] }),
        });
        const briefData = await readApiResponse<FinalBrief>(
          briefRes,
          "Something went wrong while creating your brief. Please try again.",
        );
        setBrief(briefData);
        setStage("brief");
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Your message is still here - please try again.");
      setStage("follow_up");
    }
  }, [followUpAnswer, messages]);

  const handleFinalSubmit = useCallback(async () => {
    if (finalAnswer.trim().length < 5) return;
    setStage("final_processing");
    setError(null);

    const visitorMessage: IntakeMessage = {
      role: "visitor",
      content: finalAnswer.trim(),
      timestamp: new Date().toISOString(),
      input_type: "text",
    };

    const updatedMessages = [...messages, visitorMessage];

    try {
      // After turn 3, always go to brief
      const briefRes = await fetch("/api/intake/finalise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const briefData = await readApiResponse<FinalBrief>(
        briefRes,
        "Something went wrong while creating your brief. Please try again.",
      );
      setBrief(briefData);
      setMessages(updatedMessages);
      setStage("brief");
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Your message is still here - please try again.");
      setStage("final_question");
    }
  }, [finalAnswer, messages]);

  const handleSubmitInquiry = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contact.name || !contact.email) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          brief,
          contact,
          original_input_type: transcript ? "voice" : "text",
        }),
      });

      await readApiResponse<{ success: true }>(
        res,
        "We couldn't send the brief yet. Your details haven't been lost. Please try again.",
      );

      setSubmitting(false);
      setStage("submitted");
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }, [brief, contact, messages, transcript]);

  // ── Voice recording ────────────────────────────────────────────────

  const startRecording = useCallback(async (target: RecordingTarget = "intro") => {
    recordingTargetRef.current = target;
    recordingCancelledRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      // The browser picks the container it supports (Chrome: webm, Firefox: ogg,
      // Safari/iOS: mp4). Keep the real MIME so the upload isn't mislabelled.
      const recordedMimeType = recorder.mimeType || "audio/webm";
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());

        if (recordingCancelledRef.current) {
          recordingCancelledRef.current = false;
          return;
        }

        setStage("transcribing");

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: recordedMimeType });
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const res = await fetch("/api/intake/transcribe", {
            method: "POST",
            body: formData,
          });

          const data = await readApiResponse<{ transcript: string }>(
            res,
            "Transcription failed.",
          );
          if (target === "follow_up") {
            setFollowUpAnswer(data.transcript);
          } else if (target === "final_question") {
            setFinalAnswer(data.transcript);
          } else {
            setTranscript(data.transcript);
            setTextInput(data.transcript);
          }
          setStage(target);
        } catch (err) {
          setError((err as Error).message || "We couldn't transcribe that recording. Try again, or type your message instead.");
          setStage(target);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setStage("recording");
    } catch {
      setError("Microphone access is off. You can enable it in your browser or type your message instead.");
      setStage(target);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  const cancelRecording = useCallback(() => {
    recordingCancelledRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
    setStage(recordingTargetRef.current);
  }, []);

  // ── Quick confirmation handlers ────────────────────────────────────

  const handleQuickConfirm = useCallback(async (choice: "yes" | "add" | "not_quite") => {
    if (choice === "yes") {
      setStage("follow_up_processing");
      setError(null);

      try {
        // No additional input, just finalise
        const briefRes = await fetch("/api/intake/finalise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
        const briefData = await readApiResponse<FinalBrief>(
          briefRes,
          "Something went wrong while creating your brief. Please try again.",
        );
        setBrief(briefData);
        setStage("brief");
      } catch (err) {
        setError((err as Error).message || "Something went wrong. Please try again.");
        setStage("follow_up");
      }
    } else if (choice === "add") {
      setFollowUpAnswer("");
      // Keep them on follow_up to add detail
    } else {
      setFollowUpAnswer("");
      // Keep on follow_up to re-explain
    }
  }, [messages]);

  if (!open) return null;

  return (
    <div
      className="t3-intake-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="t3-intake-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="t3-intake-modal" ref={modalRef}>
        <button
          ref={closeButtonRef}
          className="t3-intake-close"
          onClick={handleClose}
          aria-label="Close intake form"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {error && (
          <div className="t3-intake-error" role="alert">
            <p>{error}</p>
            <button onClick={() => setError(null)} type="button" className="t3-intake-error-dismiss">
              Dismiss
            </button>
          </div>
        )}

        {/* ── Step 1: Initial input ── */}
        {stage === "intro" && (
          <IntakeIntro
            textInput={textInput}
            setTextInput={setTextInput}
            firstInputRef={firstInputRef}
            onSubmit={handleInitialSubmit}
            onStartRecording={() => startRecording("intro")}
            isTranscript={!!transcript}
          />
        )}

        {/* ── Recording ── */}
        {stage === "recording" && (
          <RecordingView
            recordingTime={recordingTime}
            onStop={stopRecording}
            onCancel={cancelRecording}
          />
        )}

        {/* ── Transcribing ── */}
        {stage === "transcribing" && (
          <ProcessingState message="Transcribing your message…" />
        )}

        {/* ── AI processing ── */}
        {(stage === "initial_processing" || stage === "follow_up_processing" || stage === "final_processing") && (
          <ProcessingState
            message={
              stage === "initial_processing"
                ? "Understanding your request…"
                : stage === "follow_up_processing"
                ? "Putting the brief together…"
                : "Putting the brief together…"
            }
            subMessage="Pulling out the problem, outcome and important details."
          />
        )}

        {/* ── Step 2: Understanding + follow-up ── */}
        {stage === "follow_up" && analysis && (
          <UnderstandingStep
            analysis={analysis}
            followUpAnswer={followUpAnswer}
            setFollowUpAnswer={setFollowUpAnswer}
            onSubmit={handleFollowUpSubmit}
            onQuickConfirm={handleQuickConfirm}
            onStartRecording={() => startRecording("follow_up")}
          />
        )}

        {/* ── Step 3: Final question ── */}
        {stage === "final_question" && analysis && (
          <FinalQuestionStep
            analysis={analysis}
            finalAnswer={finalAnswer}
            setFinalAnswer={setFinalAnswer}
            onSubmit={handleFinalSubmit}
            onStartRecording={() => startRecording("final_question")}
          />
        )}

        {/* ── Brief ── */}
        {stage === "brief" && brief && (
          <BriefStep
            brief={brief}
            onSend={() => setStage("contact")}
            onBook={() => setStage("booking")}
            onEdit={() => { setStage("intro"); setAnalysis(null); }}
          />
        )}

        {/* ── Contact form ── */}
        {stage === "contact" && brief && (
          <ContactStep
            contact={contact}
            setContact={setContact}
            onSubmit={handleSubmitInquiry}
            submitting={submitting}
            onBack={() => setStage("brief")}
          />
        )}

        {/* ── Booking ── */}
        {stage === "booking" && (
          <BookingStep onBack={() => setStage("brief")} />
        )}

        {/* ── Submitted ── */}
        {stage === "submitted" && (
          <CompletionState onBookCall={() => setStage("booking")} onReset={reset} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Initial input                                            */
/* ------------------------------------------------------------------ */

function IntakeIntro({
  textInput,
  setTextInput,
  firstInputRef,
  onSubmit,
  onStartRecording,
  isTranscript,
}: {
  textInput: string;
  setTextInput: (v: string) => void;
  firstInputRef: React.RefObject<HTMLTextAreaElement | null>;
  onSubmit: () => void;
  onStartRecording: () => void;
  isTranscript: boolean;
}) {
  const canSubmit = textInput.trim().length >= 20;
  const tooShort = textInput.trim().length > 0 && textInput.trim().length < 20;

  return (
    <div className="t3-intake-step">
      <p className="t3-intake-eyebrow">T3 Labs / Project Intake</p>
      <h2 id="t3-intake-title" className="t3-intake-heading">
        What do you need help with?
      </h2>
      <p className="t3-intake-subtext">
        Tell us what&apos;s happening, what isn&apos;t working, or what you wish existed.
        You don&apos;t need to know the technical solution - just explain it in your own words.
      </p>
      <p className="t3-intake-reassurance">
        The more context you give us, the better. Our agent will work out the important parts.
      </p>

      {isTranscript && (
        <p className="t3-intake-transcript-label">Transcript (editable):</p>
      )}

      <textarea
        ref={firstInputRef}
        className="t3-intake-textarea"
        placeholder="Describe your problem, idea or goal…"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        rows={6}
        aria-label="Describe your problem, idea or goal"
        maxLength={8000}
      />

      {tooShort && (
        <p className="t3-intake-hint">
          A little more detail will help us understand what you need.
        </p>
      )}

      <button
        type="button"
        onClick={onStartRecording}
        className="t3-intake-voice-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
        Record a voice message
      </button>
      <p className="t3-intake-voice-hint">
        Speak naturally. You can explain the problem exactly as you would to a person.
      </p>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="t3-intake-primary-btn"
      >
        Continue <span aria-hidden="true">&rarr;</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recording view                                                    */
/* ------------------------------------------------------------------ */

function RecordingView({
  recordingTime,
  onStop,
  onCancel,
}: {
  recordingTime: number;
  onStop: () => void;
  onCancel: () => void;
}) {
  const minutes = Math.floor(recordingTime / 60);
  const seconds = recordingTime % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="t3-intake-step t3-intake-recording">
      <div className="t3-intake-recording-indicator">
        <span className="t3-intake-rec-dot" aria-hidden="true" />
        <span aria-live="polite">{timeStr}</span>
      </div>
      <h2 className="t3-intake-heading">Recording your message…</h2>
      <p className="t3-intake-subtext">
        A minute or two is usually plenty, but take as long as you need.
      </p>
      <div className="t3-intake-recording-actions">
        <button type="button" onClick={onStop} className="t3-intake-primary-btn">
          Stop recording
        </button>
        <button type="button" onClick={onCancel} className="t3-intake-secondary-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Processing state                                                  */
/* ------------------------------------------------------------------ */

function ProcessingState({
  message,
  subMessage,
}: {
  message: string;
  subMessage?: string;
}) {
  return (
    <div className="t3-intake-step t3-intake-processing">
      <div className="t3-intake-spinner" aria-hidden="true" />
      <h2 className="t3-intake-heading" aria-live="polite">{message}</h2>
      {subMessage && <p className="t3-intake-subtext">{subMessage}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Understanding + follow-up                               */
/* ------------------------------------------------------------------ */

function UnderstandingStep({
  analysis,
  followUpAnswer,
  setFollowUpAnswer,
  onSubmit,
  onQuickConfirm,
  onStartRecording,
}: {
  analysis: AnalysisResponse;
  followUpAnswer: string;
  setFollowUpAnswer: (v: string) => void;
  onSubmit: () => void;
  onQuickConfirm: (choice: "yes" | "add" | "not_quite") => void;
  onStartRecording: () => void;
}) {
  const canSubmit = followUpAnswer.trim().length >= 5;
  const hasFollowUp = !!analysis.follow_up_question;

  return (
    <div className="t3-intake-step">
      <p className="t3-intake-eyebrow">Here&apos;s what I&apos;m hearing</p>
      <p className="t3-intake-understanding">{analysis.understanding}</p>

      {hasFollowUp ? (
        <>
          <p className="t3-intake-eyebrow t3-intake-eyebrow--follow-up">One quick question</p>
          <p className="t3-intake-question">{analysis.follow_up_question}</p>

          <div className="t3-intake-quick-confirm">
            <button type="button" onClick={() => onQuickConfirm("yes")} className="t3-intake-chip-btn">
              Yes, that&apos;s right
            </button>
            <button type="button" onClick={() => onQuickConfirm("add")} className="t3-intake-chip-btn">
              I want to add something
            </button>
            <button type="button" onClick={() => onQuickConfirm("not_quite")} className="t3-intake-chip-btn">
              Not quite
            </button>
          </div>

          <textarea
            className="t3-intake-textarea"
            placeholder="Answer here…"
            value={followUpAnswer}
            onChange={(e) => setFollowUpAnswer(e.target.value)}
            rows={4}
            aria-label="Your answer"
            maxLength={8000}
          />

          <div className="t3-intake-actions">
            <button
              type="button"
              onClick={onStartRecording}
              className="t3-intake-voice-btn-inline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              Answer by voice
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="t3-intake-primary-btn"
            >
              Continue <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </>
      ) : (
        <p className="t3-intake-subtext">Building your brief…</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Final question (optional)                                */
/* ------------------------------------------------------------------ */

function FinalQuestionStep({
  analysis,
  finalAnswer,
  setFinalAnswer,
  onSubmit,
  onStartRecording,
}: {
  analysis: AnalysisResponse;
  finalAnswer: string;
  setFinalAnswer: (v: string) => void;
  onSubmit: () => void;
  onStartRecording: () => void;
}) {
  const canSubmit = finalAnswer.trim().length >= 5;

  return (
    <div className="t3-intake-step">
      <p className="t3-intake-eyebrow">One last detail</p>
      <p className="t3-intake-question">{analysis.follow_up_question || "Can you clarify one more thing?"}</p>

      <textarea
        className="t3-intake-textarea"
        placeholder="Answer here…"
        value={finalAnswer}
        onChange={(e) => setFinalAnswer(e.target.value)}
        rows={4}
        aria-label="Your answer"
        maxLength={8000}
      />

      <div className="t3-intake-actions">
        <button
          type="button"
          onClick={onStartRecording}
          className="t3-intake-voice-btn-inline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          Answer by voice
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="t3-intake-primary-btn"
        >
          Continue <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Brief                                                             */
/* ------------------------------------------------------------------ */

function BriefStep({
  brief,
  onSend,
  onBook,
  onEdit,
}: {
  brief: FinalBrief;
  onSend: () => void;
  onBook: () => void;
  onEdit: () => void;
}) {
  // SERVICE_LABELS is imported at the top of the file

  return (
    <div className="t3-intake-step">
      <h2 className="t3-intake-heading t3-intake-heading--brief">
        {brief.can_likely_help
          ? "This sounds like something T3 Labs can help with."
          : "Here's what I'm hearing."}
      </h2>
      <p className="t3-intake-brief-label">Here&apos;s the brief I&apos;d send to the team.</p>

      <div className="t3-intake-brief">
        <div className="t3-intake-brief-section">
          <p className="t3-intake-brief-label-sm">The problem</p>
          <p className="t3-intake-brief-text">{brief.problem}</p>
        </div>
        <div className="t3-intake-brief-section">
          <p className="t3-intake-brief-label-sm">What you want to achieve</p>
          <p className="t3-intake-brief-text">{brief.desired_outcome}</p>
        </div>
        <div className="t3-intake-brief-section">
          <p className="t3-intake-brief-label-sm">Likely solution</p>
          <p className="t3-intake-brief-text">{brief.likely_solution}</p>
        </div>
        <div className="t3-intake-brief-tags">
          {brief.relevant_areas.map((area) => (
            <span key={area} className="t3-intake-tag">
              {SERVICE_LABELS[area]}
            </span>
          ))}
        </div>
      </div>

      <button type="button" onClick={onEdit} className="t3-intake-edit-link">
        Something not right? Edit your answers
      </button>

      <div className="t3-intake-brief-actions">
        <button type="button" onClick={onSend} className="t3-intake-primary-btn t3-intake-primary-btn--full">
          Send this brief <span aria-hidden="true">&rarr;</span>
        </button>
        <button type="button" onClick={onBook} className="t3-intake-secondary-btn t3-intake-secondary-btn--full">
          Book a call
        </button>
      </div>
      <p className="t3-intake-brief-hint">
        Send this to the T3 Labs team and receive a copy by email.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact form                                                      */
/* ------------------------------------------------------------------ */

function ContactStep({
  contact,
  setContact,
  onSubmit,
  submitting,
  onBack,
}: {
  contact: ContactDetails;
  setContact: (c: ContactDetails) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  onBack: () => void;
}) {
  return (
    <div className="t3-intake-step">
      <p className="t3-intake-eyebrow">Send your brief</p>
      <h2 className="t3-intake-heading">We&apos;ll send this to the T3 Labs team and email you a copy.</h2>

      <form onSubmit={onSubmit} className="t3-intake-form" noValidate>
        <div className="t3-intake-field">
          <label htmlFor="intake-name" className="t3-intake-label">
            Name <span className="t3-intake-required">*</span>
          </label>
          <input
            id="intake-name"
            type="text"
            required
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            className="t3-intake-input"
            placeholder="Your name"
            maxLength={200}
          />
        </div>
        <div className="t3-intake-field">
          <label htmlFor="intake-email" className="t3-intake-label">
            Email <span className="t3-intake-required">*</span>
          </label>
          <input
            id="intake-email"
            type="email"
            required
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="t3-intake-input"
            placeholder="you@company.com"
            maxLength={200}
          />
        </div>
        <div className="t3-intake-field">
          <label htmlFor="intake-company" className="t3-intake-label">
            Company <span className="t3-intake-optional">(optional)</span>
          </label>
          <input
            id="intake-company"
            type="text"
            value={contact.company}
            onChange={(e) => setContact({ ...contact, company: e.target.value })}
            className="t3-intake-input"
            placeholder="Company name"
            maxLength={200}
          />
        </div>
        <div className="t3-intake-field">
          <label htmlFor="intake-phone" className="t3-intake-label">
            Phone <span className="t3-intake-optional">(optional)</span>
          </label>
          <input
            id="intake-phone"
            type="tel"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="t3-intake-input"
            placeholder="Phone number"
            maxLength={50}
          />
        </div>

        <p className="t3-intake-privacy">
          By sending this inquiry, you agree that T3 Labs can use the information you provide to respond to your request.
        </p>

        <div className="t3-intake-actions">
          <button type="button" onClick={onBack} className="t3-intake-secondary-btn">
            Back
          </button>
          <button type="submit" disabled={submitting} className="t3-intake-primary-btn">
            {submitting ? "Sending…" : "Send my brief"} {!submitting && <span aria-hidden="true">&rarr;</span>}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Booking                                                           */
/* ------------------------------------------------------------------ */

function BookingStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="t3-intake-step">
      <p className="t3-intake-eyebrow">Book a call</p>
      <h2 className="t3-intake-heading">Choose a time that works</h2>
      <p className="t3-intake-subtext">
        Your brief is ready, so you won&apos;t need to explain everything again.
      </p>

      <div className="t3-intake-booking-embed">
        <iframe
          src="https://calendly.com/cece-t3labs/20min?hide_gdpr_banner=1"
          title="Book a call with T3 Labs"
          frameBorder="0"
          loading="lazy"
        />
      </div>

      <button type="button" onClick={onBack} className="t3-intake-secondary-btn">
        Back to brief
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Completion                                                        */
/* ------------------------------------------------------------------ */

function CompletionState({
  onBookCall,
  onReset,
}: {
  onBookCall: () => void;
  onReset: () => void;
}) {
  return (
    <div className="t3-intake-step t3-intake-completion">
      <div className="t3-intake-completion-icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2 className="t3-intake-heading">Got it - your brief is with T3 Labs.</h2>
      <p className="t3-intake-subtext">We&apos;ve also sent a copy to your email.</p>

      <div className="t3-intake-completion-actions">
        <button type="button" onClick={onBookCall} className="t3-intake-secondary-btn">
          Want to speak sooner? Book a call <span aria-hidden="true">&rarr;</span>
        </button>
        <button type="button" onClick={onReset} className="t3-intake-edit-link">
          Start a new inquiry
        </button>
      </div>
    </div>
  );
}

