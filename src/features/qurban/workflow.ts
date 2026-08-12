import type { Responsibility, WorkflowStatus } from "./types";

export type WorkflowAction = "ASSIGN" | "START" | "COMPLETE";

export function nextStatus(status: WorkflowStatus): WorkflowStatus | null {
  switch (status) {
    case "BELUM_DITUGASKAN":
      return "SUDAH_DITUGASKAN";
    case "SUDAH_DITUGASKAN":
      return "SEDANG_DIKERJAKAN";
    case "SEDANG_DIKERJAKAN":
      return "SELESAI";
    default:
      return null;
  }
}

/** The single primary action available for a responsibility, if any. */
export function primaryAction(responsibility: Responsibility): WorkflowAction | null {
  switch (responsibility.status) {
    case "BELUM_DITUGASKAN":
      return "ASSIGN";
    case "SUDAH_DITUGASKAN":
      return "START";
    case "SEDANG_DIKERJAKAN":
      return "COMPLETE";
    default:
      return null;
  }
}

export const ACTION_LABEL: Record<WorkflowAction, string> = {
  ASSIGN: "Tugaskan tim",
  START: "Mulai",
  COMPLETE: "Selesaikan",
};

/**
 * Packing cannot be completed until the team has recorded at least one meat
 * intake, the single offal intake, and the final package count.
 */
export function packingBlockers(responsibility: Responsibility): string[] {
  const blockers: string[] = [];
  if (responsibility.meatIntakes.length === 0) blockers.push("At least one meat intake record");
  if (!responsibility.offalIntake) blockers.push("Offal intake record");
  if (responsibility.packageCount === null) blockers.push("Final package count");
  return blockers;
}

export function canComplete(responsibility: Responsibility): boolean {
  if (responsibility.status !== "SEDANG_DIKERJAKAN") return false;
  if (responsibility.kind !== "PACKING") return true;
  return packingBlockers(responsibility).length === 0;
}