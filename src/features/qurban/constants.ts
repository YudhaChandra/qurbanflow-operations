import type { ResponsibilityKind, WorkflowStatus } from "./types";
import type { StatusTone } from "@/components/common/StatusBadge";

export const WORKFLOW_ORDER: WorkflowStatus[] = [
  "BELUM_DITUGASKAN",
  "SUDAH_DITUGASKAN",
  "SEDANG_DIKERJAKAN",
  "SELESAI",
];

export const STATUS_LABEL: Record<WorkflowStatus, string> = {
  BELUM_DITUGASKAN: "Belum Ditugaskan",
  SUDAH_DITUGASKAN: "Sudah Ditugaskan",
  SEDANG_DIKERJAKAN: "Sedang Dikerjakan",
  SELESAI: "Selesai",
};

export const STATUS_TONE: Record<WorkflowStatus, StatusTone> = {
  BELUM_DITUGASKAN: "neutral",
  SUDAH_DITUGASKAN: "info",
  SEDANG_DIKERJAKAN: "warning",
  SELESAI: "success",
};

export const RESPONSIBILITY_ORDER: ResponsibilityKind[] = [
  "SLAUGHTER",
  "OFFAL",
  "PACKING",
];

export const RESPONSIBILITY_LABEL: Record<ResponsibilityKind, string> = {
  SLAUGHTER: "Slaughter (Jagal)",
  OFFAL: "Offal Cleaning (Jeroan)",
  PACKING: "Packing",
};

export const RESPONSIBILITY_SHORT: Record<ResponsibilityKind, string> = {
  SLAUGHTER: "Jagal",
  OFFAL: "Jeroan",
  PACKING: "Packing",
};