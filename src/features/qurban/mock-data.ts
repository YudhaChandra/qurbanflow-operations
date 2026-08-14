import type { Animal, AnimalType, QurbanEvent, ResponsibilityKind, Team, WorkflowStatus } from "./types";
import { RESPONSIBILITY_ORDER } from "./constants";

export const mockEvent: QurbanEvent = {
  id: "evt-1",
  name: "Qurban 1447 H — Masjid Al-Ikhlas",
  date: "2026-05-27",
  location: "Lapangan Al-Ikhlas, Bandung",
  completed: false,
};

export const mockTeams: Team[] = [
  { id: "team-jagal-1", name: "Tim Jagal 1", kind: "SLAUGHTER" },
  { id: "team-jagal-2", name: "Tim Jagal 2", kind: "SLAUGHTER" },
  { id: "team-jeroan-1", name: "Tim Jeroan 1", kind: "OFFAL" },
  { id: "team-jeroan-2", name: "Tim Jeroan 2", kind: "OFFAL" },
  { id: "team-packing-1", name: "Tim Packing 1", kind: "PACKING" },
  { id: "team-packing-2", name: "Tim Packing 2", kind: "PACKING" },
];

type Seed = {
  code: string;
  type: AnimalType;
  shahibul: string[];
  state: Partial<Record<ResponsibilityKind, { status: WorkflowStatus; teamId?: string }>>;
};

const seeds: Seed[] = [
  {
    code: "SAPI 01",
    type: "SAPI",
    shahibul: ["H. Ahmad Fauzi", "Keluarga Siregar", "Rina Wulandari", "Budi Santoso", "Ust. Kholid", "Yayasan Amanah", "Dewi Lestari"],
    state: {
      SLAUGHTER: { status: "SELESAI", teamId: "team-jagal-1" },
      OFFAL: { status: "SELESAI", teamId: "team-jeroan-1" },
      PACKING: { status: "SEDANG_DIKERJAKAN", teamId: "team-packing-1" },
    },
  },
  {
    code: "SAPI 02",
    type: "SAPI",
    shahibul: ["Keluarga Hidayat", "Pak Sutarno", "Ibu Marlina", "Andi Prasetyo", "Nurul Hasanah", "Fajar Nugroho", "Hj. Aminah"],
    state: {
      SLAUGHTER: { status: "SELESAI", teamId: "team-jagal-1" },
      OFFAL: { status: "SEDANG_DIKERJAKAN", teamId: "team-jeroan-2" },
      PACKING: { status: "SUDAH_DITUGASKAN", teamId: "team-packing-2" },
    },
  },
  {
    code: "SAPI 03",
    type: "SAPI",
    shahibul: ["RT 04 Kelurahan Cibaduyut", "Keluarga Wijaya", "Sri Rahayu", "Iwan Setiawan", "Ustadzah Laila", "Toko Berkah", "Pak Darmanto"],
    state: {
      SLAUGHTER: { status: "SEDANG_DIKERJAKAN", teamId: "team-jagal-2" },
      OFFAL: { status: "SUDAH_DITUGASKAN", teamId: "team-jeroan-1" },
      PACKING: { status: "BELUM_DITUGASKAN" },
    },
  },
  {
    code: "SAPI 04",
    type: "SAPI",
    shahibul: ["Keluarga Pratama", "Bapak Suryadi", "Ibu Kartini", "Rizky Maulana", "Hendra Gunawan", "Siti Aisyah", "Koperasi Sejahtera"],
    state: {
      SLAUGHTER: { status: "SUDAH_DITUGASKAN", teamId: "team-jagal-2" },
      OFFAL: { status: "BELUM_DITUGASKAN" },
      PACKING: { status: "BELUM_DITUGASKAN" },
    },
  },
  {
    code: "KAMBING 01",
    type: "KAMBING",
    shahibul: ["Dr. Imam Subekti"],
    state: {
      SLAUGHTER: { status: "SELESAI", teamId: "team-jagal-1" },
      OFFAL: { status: "SELESAI", teamId: "team-jeroan-1" },
      PACKING: { status: "SELESAI", teamId: "team-packing-1" },
    },
  },
  {
    code: "KAMBING 02",
    type: "KAMBING",
    shahibul: ["Ibu Ratna Dewi"],
    state: {
      SLAUGHTER: { status: "SELESAI", teamId: "team-jagal-2" },
      OFFAL: { status: "SUDAH_DITUGASKAN", teamId: "team-jeroan-2" },
      PACKING: { status: "BELUM_DITUGASKAN" },
    },
  },
  {
    code: "KAMBING 03",
    type: "KAMBING",
    shahibul: ["Keluarga Alm. Sukirman"],
    state: {
      SLAUGHTER: { status: "SEDANG_DIKERJAKAN", teamId: "team-jagal-1" },
      OFFAL: { status: "BELUM_DITUGASKAN" },
      PACKING: { status: "BELUM_DITUGASKAN" },
    },
  },
  {
    code: "KAMBING 04",
    type: "KAMBING",
    shahibul: ["Bapak Zainal Arifin"],
    state: {
      SLAUGHTER: { status: "BELUM_DITUGASKAN" },
      OFFAL: { status: "BELUM_DITUGASKAN" },
      PACKING: { status: "BELUM_DITUGASKAN" },
    },
  },
  {
    code: "KAMBING 05",
    type: "KAMBING",
    shahibul: ["Majelis Taklim An-Nur"],
    state: {
      SLAUGHTER: { status: "BELUM_DITUGASKAN" },
      OFFAL: { status: "BELUM_DITUGASKAN" },
      PACKING: { status: "BELUM_DITUGASKAN" },
    },
  },
];

export function createMockAnimals(): Animal[] {
  return seeds.map((seed, index) => {
    const animal: Animal = {
      id: `animal-${index + 1}`,
      code: seed.code,
      type: seed.type,
      shahibul: seed.shahibul.map((name, i) => ({
        id: `animal-${index + 1}-shahibul-${i + 1}`,
        name,
        ...(i === 0 ? { phone: "0812-3456-7890" } : {}),
      })),
      responsibilities: {} as Animal["responsibilities"],
    };

    for (const kind of RESPONSIBILITY_ORDER) {
      const state = seed.state[kind];
      const status = state?.status ?? "BELUM_DITUGASKAN";
      const isPacking = kind === "PACKING";
      animal.responsibilities[kind] = {
        kind,
        status,
        teamId: state?.teamId ?? null,
        meatIntakes:
          isPacking && status !== "BELUM_DITUGASKAN" && status !== "SUDAH_DITUGASKAN"
            ? [
                { id: `${animal.id}-meat-1`, weightKg: 42.5, recordedAt: "07:41" },
                { id: `${animal.id}-meat-2`, weightKg: 38, recordedAt: "08:12" },
              ]
            : [],
        offalIntake:
          isPacking && status === "SELESAI"
            ? { weightKg: 12.4, recordedAt: "08:20" }
            : null,
        packageCount: isPacking && status === "SELESAI" ? 96 : null,
      };
    }

    return animal;
  });
}