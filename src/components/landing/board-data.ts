export type BoardStatus = "idle" | "assigned" | "progress" | "done";

export interface BoardCard {
  animal: string;
  shahibul: string;
  team: string;
  role: string;
}

export interface BoardColumn {
  title: string;
  status: BoardStatus;
  cards: BoardCard[];
}

export const statusStyles: Record<BoardStatus, { dot: string; chip: string }> = {
  idle: { dot: "bg-status-idle", chip: "bg-muted text-muted-foreground" },
  assigned: { dot: "bg-status-assigned", chip: "bg-primary-soft text-accent-foreground" },
  progress: {
    dot: "bg-status-progress",
    chip: "bg-status-progress/15 text-status-progress",
  },
  done: { dot: "bg-status-done", chip: "bg-status-done/15 text-status-done" },
};

export const heroBoard: BoardColumn[] = [
  {
    title: "Belum Ditugaskan",
    status: "idle",
    cards: [{ animal: "KAMBING 04", shahibul: "1 shahibul", team: "Belum ada tim", role: "Menunggu" }],
  },
  {
    title: "Sudah Ditugaskan",
    status: "assigned",
    cards: [{ animal: "SAPI 04", shahibul: "7 shahibul", team: "Tim Jagal 2", role: "Siap mulai" }],
  },
  {
    title: "Sedang Dikerjakan",
    status: "progress",
    cards: [{ animal: "SAPI 03", shahibul: "7 shahibul", team: "Tim Jagal 2", role: "Penyembelihan" }],
  },
  {
    title: "Selesai",
    status: "done",
    cards: [{ animal: "SAPI 01", shahibul: "7 shahibul", team: "Tim Jagal 1", role: "Selesai" }],
  },
];

export const fullBoard: BoardColumn[] = [
  {
    title: "Belum Ditugaskan",
    status: "idle",
    cards: [
      { animal: "KAMBING 04", shahibul: "1 shahibul", team: "Belum ada tim", role: "Menunggu" },
      { animal: "KAMBING 05", shahibul: "1 shahibul", team: "Belum ada tim", role: "Menunggu" },
    ],
  },
  {
    title: "Sudah Ditugaskan",
    status: "assigned",
    cards: [{ animal: "SAPI 04", shahibul: "7 shahibul", team: "Tim Jagal 2", role: "Siap mulai" }],
  },
  {
    title: "Sedang Dikerjakan",
    status: "progress",
    cards: [
      { animal: "SAPI 03", shahibul: "7 shahibul", team: "Tim Jagal 2", role: "Penyembelihan" },
      { animal: "KAMBING 03", shahibul: "1 shahibul", team: "Tim Jeroan 1", role: "Jeroan" },
    ],
  },
  {
    title: "Selesai",
    status: "done",
    cards: [
      { animal: "SAPI 01", shahibul: "7 shahibul", team: "Tim Jagal 1", role: "Packing selesai" },
      { animal: "SAPI 02", shahibul: "7 shahibul", team: "Tim Packing 1", role: "Packing selesai" },
      { animal: "KAMBING 01", shahibul: "1 shahibul", team: "Tim Jagal 1", role: "Packing selesai" },
      { animal: "KAMBING 02", shahibul: "1 shahibul", team: "Tim Packing 2", role: "Packing selesai" },
    ],
  },
];

export const workflowSteps = [
  "Belum Ditugaskan",
  "Sudah Ditugaskan",
  "Sedang Dikerjakan",
  "Selesai",
];
