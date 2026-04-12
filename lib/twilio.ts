// ============================================================
// Twilio SMS Service
// ============================================================

import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const FROM = process.env.TWILIO_PHONE_NUMBER!;

/**
 * Send an SMS message via Twilio.
 */
export async function sendSMS(to: string, body: string): Promise<boolean> {
  try {
    await client.messages.create({ from: FROM, to, body });
    return true;
  } catch (err) {
    console.error("[twilio] Failed to send SMS to", to, err);
    return false;
  }
}

/**
 * Format a phone number to E.164 format (+1XXXXXXXXXX).
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

// ============================================================
// SMS Message Templates
// ============================================================

export function smsJobOffer(jobId: string, details: {
  age: number;
  gender: string;
  zip: string;
  examType: string;
  schedulingSummary: string;
}): string {
  return (
    `🩺 PHLOBOT JOB AVAILABLE\n` +
    `Age: ${details.age} | Gender: ${details.gender} | ZIP: ${details.zip}\n` +
    `Exam: ${details.examType}\n` +
    `When: ${details.schedulingSummary}\n\n` +
    `Reply YES to claim or NO to pass.\n` +
    `Job ID: ${jobId.slice(-6).toUpperCase()}`
  );
}

export function smsJobWon(details: {
  age: number;
  gender: string;
  zip: string;
  examType: string;
  schedulingSummary: string;
}): string {
  return (
    `✅ YOU GOT IT! PHLOBOT JOB CONFIRMED\n` +
    `Age: ${details.age} | Gender: ${details.gender} | ZIP: ${details.zip}\n` +
    `Exam: ${details.examType} | When: ${details.schedulingSummary}\n\n` +
    `Check your email — we've connected you with the advisor. Good luck!`
  );
}

export function smsJobLost(position: number, minutesLate?: number): string {
  if (minutesLate !== undefined && minutesLate > 0) {
    return (
      `⏱ Just missed it! You were #${position} in line — ` +
      `only ${minutesLate} minute${minutesLate === 1 ? "" : "s"} behind the winner.\n` +
      `Respond faster next time — stay ready! 💪`
    );
  }
  return (
    `⏱ Just missed it! You were #${position} in line.\n` +
    `Stay sharp — more jobs are coming! 💪`
  );
}

export function smsUnfilledAdvisor(): string {
  return (
    `📋 PHLOBOT UPDATE: Your exam request has been open for 24 hours with no takers yet.\n` +
    `Tip: Try expanding your available times. Log in to update your request.\n` +
    `phlobot.com/dashboard`
  );
}
