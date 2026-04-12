"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SchedulingType = "exact" | "window" | "multiple" | "any_weekday" | "any_weekend";

interface WindowOption {
  date: string;
  start: string;
  end: strin
}

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Patient info
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [zip, setZip] = useState("");
  const [examType, setExamType] = useState("");
  const [notes, setNotes] = useState("");

  // Scheduling
  const [schedulingType, setSchedulingType] = useState<SchedulingType>("window");

  // Exact time
  const [exactDate, setExactDate] = useState("");
  const [exactTime, setExactTime] = useState("");

  // Single window
  const [windowDate, setWindowDate] = useState("");
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");

  // Multiple windows
  const [multipleWindows, setMultipleWindows] = useState<WindowOption[]>([
    { date: "", start: "", end: "" },
    { date: "", start: "", end: "" },
  ]);

  // Any weekday/weekend
  const [anyTimeStart, setAnyTimeStart] = useState("");
  const [anyTimeEnd, setAnyTimeEnd] = useState("");

  function updateWindow(i: number, field: keyof WindowOption, value: string) {
    setMultipleWindows(prev => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [field]: value };
      return updated;
    });
  }

  function addWindow() {
    if (multipleWindows.length < 5) {
      setMultipleWindows(prev => [...prev, { date: "", start: "", end: "" }]);
    }
  }

  function removeWindow(i: number) {
    setMultipleWindows(prev => prev.filter((_, idx) => idx !== i));
  }

  function buildSchedulingOptions() {
    switch (schedulingType) {
      case "exact":
        return [{ date: exactDate, time: exactTime }];
      case "window":
        return [{ date: windowDate, start: windowStart, end: windowEnd }];
      case "multiple":
        return multipleWindows.filter(w => w.date && w.start && w.end);
      case "any_weekday":
        return [{ type: "any_weekday", start: anyTimeStart, end: anyTimeEnd }];
      case "any_weekend":
        return [{ type: "any_weekend", start: anyTimeStart, end: anyTimeEnd }];
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const schedulingOptions = buildSchedulingOptions();
    if (!schedulingOptions || schedulingOptions.length === 0) {
      setError("Please fill in all scheduling details.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_age: parseInt(age),
        patient_gender: gender,
        patient_zip: zip,
        exam_type: examType,
        scheduling_type: schedulingType,
        scheduling_options: schedulingOptions,
        notes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            ← Back
          </Link>
          <span className="text-xl font-bold text-brand-700">🩺 Phlobot</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">New Exam Request</h1>
        <p className="text-gray-500 mb-8">
          Fill in the details below — we&apos;ll text nearby examiners right away.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Patient Information</h2>
            <p className="text-sm text-gray-500 -mt-2">
              No name or address — just the basics to find the right examiner.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Age *</label>
                <input
                  type="number"
                  className="input"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  required
                  min="1"
                  max="120"
                  placeholder="42"
                />
              </div>
              <div>
                <label className="label">Gender *</label>
                <select
                  className="input"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Patient ZIP Code *</label>
                <input
                  type="text"
                  className="input"
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                  required
                  maxLength={5}
                  pattern="\d{5}"
                  placeholder="80202"
                />
              </div>
              <div>
                <label className="label">Exam Type *</label>
                <select
                  className="input"
                  value={examType}
                  onChange={e => setExamType(e.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  <option>Paramedical Exam</option>
                  <option>Plood Draw Only</option>
                  <option>Urine Only</option>
                  <option>Blood & Urine</option>
                  <option>EKG</option>
                  <option>Full Exam</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Scheduling *</h2>

            {/* Type selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { value: "exact",       label: "Exact time",         sub: "Specific date & time" },
                { value: "window",      label: "Time window",        sub: "Date + 2-hour range" },
                { value: "multiple",    label: "Multiple options",    sub: "Several dates to choose" },
                { value: "any_weekday", label: "Any weekday",        sub: "Mon–Fri window" },
                { value: "any_weekend", label: "Any weekend day",    sub: "Sat or Sun window" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSchedulingType(opt.value as SchedulingType)}
                  className={`text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    schedulingType === opt.value
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.sub}</div>
                </button>
              ))}
            </div>

            {/* Exact */}
            {schedulingType === "exact" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Date *</label>
                  <input type="date" className="input" value={exactDate}
                    onChange={e => setExactDate(e.target.value)} required min={minDate} />
                </div>
                <div>
                  <label className="label">Time *</label>
                  <input type="time" className="input" value={exactTime}
                    onChange={e => setExactTime(e.target.value)} required />
                </div>
              </div>
            )}

            {/* Window */}
            {schedulingType === "window" && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Pate *</label>
                  <input type="date" className="input" value={windowDate}
                    onChange={e => setWindowDate(e.target.value)} required min={minDate} />
                </div>
                <div>
                  <label className="label">From *</label>
                  <input type="time" className="input" value={windowStart}
                    onChange={e => setWindowStart(e.target.value)} required />
                </div>
                <div>
                  <label className="label">To *</label>
                  <input type="time" className="input" value={windowEnd}
                    onChange={e => setWindowEnd(e.target.value)} required />
                </div>
              </div>
            )}

            {/* Multiple */}
            {schedulingType === "multiple" && (
              <div className="space-y-3">
                {multipleWindows.map((w, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="label">Date {i + 1} *</label>
                      <input type="date" className="input" value={w.date}
                        onChange={e => updateWindow(i, "date", e.target.value)} min={minDate} />
                    </div>
                    <div>
                      <label className="label">From *</label>
                      <input type="time" className="input" value={w.start}
                        onChange={e => updateWindow(i, "start", e.target.value)} />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="label">To *</label>
                        <input type="time" className="input" value={w.end}
                          onChange={e => updateWindow(i, "end", e.target.value)} />
                      </div>
                      {multipleWindows.length > 1 && (
                        <button type="button" onClick={() => removeWindow(i)}
                          className="text-red-400 hover:text-red-600 pb-2.5 text-lg">✕</button>
                      )}
                    </div>
                  </div>
                ))}
                {multipleWindows.length < 5 && (
                  <button type="button" onClick={addWindow}
                    className="text-sm text-brand-600 font-semibold hover:underline">
                    + Add another date
                  </button>
                )}
              </div>
            )}

            {/* Any weekday / weekend */}
            {(schedulingType === "any_weekday" || schedulingType === "any_weekend") && (
              <div>
                <p className="text-sm text-gray-500 mb-3">
                  What time window works?
                  {schedulingType === "any_weekday"
                    ? " Examiner will pick a weekday (Mon–Fri)."
                    : " Examiner will pick a weekend day (Sat or Sun)."}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">From *</label>
                    <input type="time" className="input" value={anyTimeStart}
                      onChange={e => setAnyTimeStart(e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">To *</label>
                    <input type="time" className="input" value={anyTimeEnd}
                      onChange={e => setAnyTimeEnd(e.target.value)} required />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <label className="label">Notes (optional)</label>
            <textarea
              className="input"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any special instructions for the examiner..."
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? "Submitting…" : "Submit Request →"}
            </button>
            <Link href="/dashboard" className="btn-secondary px-6">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
