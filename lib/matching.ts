// =========================================================
// Examiner Matching — finds examiners within radius of a job ZIP
// =========================================================

import { createServiceClient } from "@/lib/supabase/server";
import { zipToLatLng, distanceMiles } from "@/lib/geocoding";
import { Examiner } from "@/lib/types";

export interface MatchedExaminer {
  examiner: Examiner;
  distanceMiles: number;
}

/**
 * Given a job ZIP code, returns all active examiners within their stated radius,
 * sorted by distance (closest first).
 *
 * Two-step matching strategy:
 *   1. Exact zip_code match — always works, zero geocoding dependency
 *   2. Geocode the job ZIP and add any radius-match examiners not already included
 *
 * This ensures at least one examiner is found even when the geocoding API is
 * temporarily unavailable (e.g. zippopotam.us timeout).
 */
export async function findExaminersForZip(
  jobZip: string
): Promise<MatchedExaminer[]> {
  const supabase = createServiceClient();
  const { data: examiners, error } = await supabase
    .from("examiners")
    .select("*")
    .eq("active", true);

  if (error || !examiners) {
    console.error("[matching] Error fetching examiners:", error);
    return [];
  }

  const matchMap = new Map<string, MatchedExaminer>();

  // Step 1: exact zip match — always works, no geocoding needed
  for (const examiner of examiners as Examiner[]) {
    if (examiner.zip_code?.trim() === jobZip.trim()) {
      matchMap.set(examiner.id, { examiner, distanceMiles: 0 });
    }
  }

  // Step 2: geocode and add radius matches (best-effort)
  const jobCoords = await zipToLatLng(jobZip);
  if (jobCoords) {
    for (const examiner of examiners as Examiner[]) {
      if (!examiner.lat || !examiner.lng) continue;
      const dist = distanceMiles(jobCoords, {
        lat: Number(examiner.lat),
        lng: Number(examiner.lng),
      });
      if (dist <= examiner.radius_miles && !matchMap.has(examiner.id)) {
        matchMap.set(examiner.id, {
          examiner,
          distanceMiles: Math.round(dist * 10) / 10,
        });
      }
    }
  } else {
    console.warn(
      `[matching] Geocoding failed for ZIP ${jobZip} — falling back to exact-zip matches only`
    );
  }

  const matches = Array.from(matchMap.values());
  matches.sort((a, b) => a.distanceMiles - b.distanceMiles);
  return matches;
}
