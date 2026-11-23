import type { CheckInResult } from "@/types/gatekeeper";

// Sound and vibration after a scan (PRD §13.9), so the gatekeeper can keep eyes on the crowd.
const TONES: Record<CheckInResult, { frequencies: number[]; vibrate: number[] }> = {
  success: { frequencies: [880], vibrate: [80] },
  duplicate: { frequencies: [520, 520], vibrate: [120, 80, 120] },
  expired: { frequencies: [300, 300], vibrate: [300, 100, 300] },
  invalid: { frequencies: [220, 220], vibrate: [300, 100, 300] },
};

export function signalResult(result: CheckInResult) {
  const tone = TONES[result];
  navigator.vibrate?.(tone.vibrate);

  try {
    const context = new AudioContext();
    tone.frequencies.forEach((frequency, i) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.12;
      oscillator.connect(gain).connect(context.destination);
      const at = context.currentTime + i * 0.2;
      oscillator.start(at);
      oscillator.stop(at + 0.14);
    });
    setTimeout(() => void context.close(), 800);
  } catch {
    // No audio available: the colour and vibration still show the result.
  }
}
