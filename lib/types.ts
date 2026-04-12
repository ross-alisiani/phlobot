// ============================================================
// Phlobot – Shared TypeScript Types
// ============================================================

export type UserRole = "advisor" | "admin";

export type JobStatus =
  | "pending"       // just created, not yet broadcast
  | "broadcast"     // SMS sent to examiners, waiting for response
  | "assigned"      // examiner accepted
  | "completed"     // exam done
  | "canceled"      // canceled by advisor or admin
  | "unfilled";     // 24h passed with no acceptance

export type SchedulingType = "exact" | "window" | "multiple" | "any_weekday" | "any_weekend";

export interface SchedulingOption {
  type?: "any_weekday" | "any_weekend";
  date?: string;       // "YYYY-MM-DD"
  time?: string;       // "HH:MM" (exact only)
  start?: string;      // "HH:MM" (window)
  end?: string;        // "HH:MM" (window)
}

export interface AdvisorProfile {
  id: string;
  user_id: string;
  name: string;
  company_name?: string;
  phone?: string;
  email: string;
  plan_tier: string;
  jobs_this_month: number;
  billing_cycle_start: string;
  created_at: string;
}

export interface Examiner {
  id: string;
  name: string;
  email: string;
  phone: string;
  zip_code: string;
  lat?: number;
  lng?: number;
  radius_miles: number;
  active: boolean;
  notes?: string;
  created_at: string;
}

export interface JobRequest {
  id: string;
  advisor_id: string;
  patient_age?: number;
  patient_gender?: string;
  patient_zip: string;
  exam_type?: string;
  scheduling_type: SchedulingType;
  scheduling_options: SchedulingOption[];
  status: JobStatus;
  assigned_examiner_id?: string;
  final_scheduled_time?: string;
  broadcast_at?: string;
  assigned_at?: string;
  completed_at?: string;
  unfilled_notified_at?: string;
  notes?: string;
  created_at: string;
  // Joined fields
  advisor?: AdvisorProfile;
  assigned_examiner?: Examiner;
}

export interface JobOffer {
  id: string;
  job_request_id: string;
  examiner_id: string;
  sms_sent_at: string;
  responded_at?: string;
  response: "yes" | "no" | "pending";
  response_position?: number;
  minutes_after_winner?: number;
  created_at: string;
  // Joined
  examiner?: Examiner;
}
