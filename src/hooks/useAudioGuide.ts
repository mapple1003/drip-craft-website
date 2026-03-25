"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Lang = "ja" | "en" | "zh" | "ko";

const LANG_CODES: Record<Lang, string> = {
  ja: "ja-JP",
  en: "en-US",
  zh: "zh-CN",
  ko: "ko-KR",
};

export type AudioGuideState = "idle" | "playing" | "unsupported";

export function useAudioGuide(lang: Lang) {
  const [state, setState] = useState<AudioGuideState>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setState("unsupported");
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Stop when language changes
  useEffect(() => {
    if (state === "playing") {
      window.speechSynthesis?.cancel();
      setState("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return;

      if (state === "playing") {
        window.speechSynthesis.cancel();
        setState("idle");
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_CODES[lang];
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onstart = () => setState("playing");
      utterance.onend = () => setState("idle");
      utterance.onerror = () => setState("idle");

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [lang, state]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setState("idle");
  }, []);

  return { state, speak, stop };
}
