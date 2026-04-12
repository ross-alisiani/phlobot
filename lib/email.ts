// ============================================================
// Email Service (Resend)
// ============================================================

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@phlobot.com";
const FROM_NAME = "Phlobot";

/**
 * Send the connection email to both advisor and examiner after a job is claimed.
 */
export async function sendConnectionEmail(params: { advisorName: string; advisorEmail: string; examinerName: string; examinerEmail: string; jobDetails: { age: number; gender: string; zip: string; examType: string; schedulingSummary: string; jobId: string; }; }): Promise<boolean> {
  const { advisorName, advisorEmail, examinerName, examinerEmail, jobDetails } = params;
  const jobRef = jobDetails.jobId.slice(-6).toUpperCase();
  const subject = `✅ Phlobot: Exam Request Filled – Job #${jobRef}`;
  const html = `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;color:#1f2937;}.container{max-width:560px;margin:0 auto;padding:32px 24px;}.header{background:#1d4ed8;color:white;padding:24px;text-align:center;}.body{background:#f9fafb;padding:24px;border:1px solid #e5e7eb;}.action-box{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-top:20px;}</style></head><body><div class="container"><div class="header"><h1>🩺 Phlobot</h1><p style="margin:8px 0 0 0;opacity:0.85;">Your exam request has been filled</p></div><div class="body"><h2>Exam Details &#123;jobRef}#</h2><p>Patient: Age ${jobDetails.age} | ${jobDetails.gender} | ZIP ${jobDetails.zip}</p><p>Exam Type: ${jobDetails.examType}</p><p>Scheduling: ${jobDetails.schedulingSummary}</p><p>Advisor: ${advisorName} (${advisorEmail})</p><p>Examiner: ${examinerName} (${examinerEmail})</p><div class="action-box"><h3>Next Steps</h3><p>Please email each other to coordinate patient details and appointment timing. Phlobot steps aside from here.</p></div></div><p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px;">This is an automated message from Phlobot. Please do not reply.</p></div></body></html>`;
  try {
    await resend.emails.send({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: [advisorEmail, examinerEmail], subject, html });
    return true;
  } catch (err) { console.error("[email]", err); return false; }


export async function sendUnfilledEmail(params: { advisorName: string; advisorEmail: string; jobDetails: { age: number; gender: string; zip: string; examType: string; jobId: string; }; dashboardUrl: string; }): Promise<boolean> {
  const { advisorName, advisorEmail, jobDetails, dashboardUrl } = params;
  const jobRef = jobDetails.jobId.slice(-6).toUpperCase();
  try {
    await resend.emails.send({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: advisorEmail, subject: `📋 Phlobot: Job #${jobRef} still needs an examiner`, html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;"><h2>Hi ${advisorName},</h2><p>Job #${jobRef} has been open 24h without a claim. Details: Age ${jobDetails.age} | ${jobDetails.gender} | ZIP ${jobDetails.zip} | ${jobDetails.examType}</p><p><a href="${dashboardUrl}">Update My Request</a></p></div>` });
    return true;
  } catch (err) { console.error("[email]", err); return false; }
}
