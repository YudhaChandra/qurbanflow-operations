import type { AnimalType, ResponsibilityKind, WorkflowStatus } from "./types";
import type { StatusTone } from "@/components/common/StatusBadge";

export const ANIMAL_TYPE_LABEL: Record<AnimalType, string> = {
  SAPI: "Sapi",
  KAMBING: "Kambing",
};

/** Shahibul capacity per animal type. */
export const SHAHIBUL_LIMIT: Record<AnimalType, { min: number; max: number }> = {
  SAPI: { min: 1, max: 7 },
  KAMBING: { min: 1, max: 1 },
};

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
  SLAUGHTER: "Jagal",
  OFFAL: "Jeroan",
  PACKING: "Packing",
};

export const RESPONSIBILITY_SHORT: Record<ResponsibilityKind, string> = {
  SLAUGHTER: "Jagal",
  OFFAL: "Jeroan",
  PACKING: "Packing",
};

export const EVENT_STATUS_LABEL: Record<import("./types").EventStatus, string> = {
  DRAFT: "Draft",
  AKTIF: "Aktif",
  SELESAI: "Selesai",
};

export const EVENT_STATUS_TONE: Record<import("./types").EventStatus, StatusTone> = {
  DRAFT: "neutral",
  AKTIF: "info",
  SELESAI: "success",
};