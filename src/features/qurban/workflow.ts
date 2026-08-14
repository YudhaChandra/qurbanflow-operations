import type { Animal, Responsibility, WorkflowStatus } from "./types";
import { RESPONSIBILITY_ORDER, SHAHIBUL_LIMIT } from "./constants";

/** Shahibul capacity + completeness rules for one animal. */
export function shahibulLimit(animal: Animal) {
  return SHAHIBUL_LIMIT[animal.type];
}

export function canAddShahibul(animal: Animal): boolean {
  return animal.shahibul.length < shahibulLimit(animal).max;
}

export function shahibulBlocker(animal: Animal): string | null {
  const { min, max } = shahibulLimit(animal);
  const count = animal.shahibul.length;
  if (count < min)
    return max === min
      ? `Hewan ini wajib memiliki tepat ${min} shahibul.`
      : `Hewan ini wajib memiliki minimal ${min} shahibul.`;
  return null;
}

/** Aggregated operational status of one animal across all responsibilities. */
export function animalStatus(animal: Animal): WorkflowStatus {
  const statuses = RESPONSIBILITY_ORDER.map(
    (kind) => animal.responsibilities[kind].status,
  );
  if (statuses.every((status) => status === "SELESAI")) return "SELESAI";
  if (statuses.some((status) => status === "SEDANG_DIKERJAKAN")) return "SEDANG_DIKERJAKAN";
  if (statuses.some((status) => status === "SUDAH_DITUGASKAN" || status === "SELESAI"))
    return "SUDAH_DITUGASKAN";
  return "BELUM_DITUGASKAN";
}

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
  if (responsibility.meatIntakes.length === 0) blockers.push("Minimal satu catatan timbangan daging");
  if (!responsibility.offalIntake) blockers.push("Catatan timbangan jeroan");
  if (responsibility.packageCount === null) blockers.push("Jumlah paket akhir");
  return blockers;
}

export function canComplete(responsibility: Responsibility): boolean {
  if (responsibility.status !== "SEDANG_DIKERJAKAN") return false;
  if (responsibility.kind !== "PACKING") return true;
  return packingBlockers(responsibility).length === 0;
}