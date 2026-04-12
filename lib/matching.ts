// ============================================================
// Examiner Matching – finds examiners within radius of a job ZIP
// ============================================================

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
 */
export async function findExaminersForZip(
  jobZip: string
): Promise<MatchedExaminer[]> {
  const jobCoords = await zipToLatLng(jobZip);
  if (!jobCoords) {
    console.error(`[matching] Could not geocode job ZIP: ${jobZip}`);
    return [];
  }

  const supabase = createServiceClient();
  const { data: examiners, error } = await supabase
    .from("examiners")
    .select("*")
    .eq("active", true)
    .not("lat", "is", null)
    .not("lng", "is", null);

  if (error || !examiners) {
    console.error("[matching] Error fetching examiners:", error);
    return [];
  }

  const matches: MatchedExaminer[] = [];

  for (const examiner of examiners as Examiner[]) {
    if (!examiner.lat || !examiner.lng) continue;

    const dist = distanceMiles(jobCoords, {
      lat: examiner.lat,
      lng: examiner.lng,
    });

    if (dist <= examiner.radius_miles) {
      matches.push({ examiner, distanceMiles: Math.round(dist * 10) / 10 });
    }
  }

  // Sort by distance, closest first
  matches.sort((a, b) => a.distanceMiles - b.distanceMiles);

  return matches;
}
