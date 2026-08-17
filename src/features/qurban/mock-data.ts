import type {
  Animal,
  AnimalType,
  QurbanEvent,
  ResponsibilityKind,
  SystemUser,
  Team,
  WorkflowStatus,
} from "./types";
import { RESPONSIBILITY_ORDER } from "./constants";

export const mockEvents: QurbanEvent[] = [
  {
    id: "evt-1",
    name: "Qurban 1447 H — Masjid Al-Ikhlas",
    date: "2026-05-27",
    location: "Lapangan Al-Ikhlas, Bandung",
    description: "Operasi kurban utama tahun 1447 H mencakup area Bandung Timur.",
    status: "AKTIF",
    completed: false,
  },
  {
    id: "evt-2",
    name: "Qurban 1448 H — Persiapan Masjid Al-Ikhlas",
    date: "2027-05-16",
    location: "Kompleks Masjid Al-Ikhlas, Bandung",
    description: "Rencana kegiatan kurban tahun 1448 H yang masih dalam tahap draf.",
    status: "DRAFT",
    completed: false,
  },
  {
    id: "evt-3",
    name: "Qurban 1446 H — Masjid Al-Ikhlas",
    date: "2025-06-07",
    location: "Halaman Masjid Al-Ikhlas, Bandung",
    description: "Dokumentasi dan arsip historis pelaksaaan kurban 1446 H.",
    status: "SELESAI",
    completed: true,
  },
];

export const mockEvent: QurbanEvent = mockEvents[0];

export const mockUsers: SystemUser[] = [
  { id: "user-1", name: "Ust. Kholid Ridwan", phone: "0812-1100-2201", role: "Supervisor" },
  { id: "user-2", name: "Agus Salim", phone: "0812-1100-2202", role: "Supervisor" },
  { id: "user-3", name: "Bambang Sutejo", phone: "0812-1100-2203", role: "Koordinator" },
  { id: "user-4", name: "Hendra Wijaya", phone: "0812-1100-2204", role: "Koordinator" },
  { id: "user-5", name: "Rizal Mahendra", phone: "0812-1100-2205", role: "Koordinator" },
  { id: "user-6", name: "Slamet Riyadi", phone: "0812-1100-2206", role: "Koordinator" },
  { id: "user-7", name: "Dedi Kurniawan", phone: "0812-1100-2207", role: "Koordinator" },
  { id: "user-8", name: "Taufik Hidayat", phone: "0812-1100-2208", role: "Koordinator" },
  { id: "user-9", name: "Ridho Firmansyah", phone: "0812-1100-2209", role: "Koordinator" },
  { id: "user-10", name: "Maman Suherman", phone: "0812-1100-2210", role: "Koordinator" },
];

export const mockTeams: Team[] = [
  {
    id: "team-jagal-1",
    name: "Tim Jagal 1",
    kind: "SLAUGHTER",
    leaderUserId: "user-1",
    members: [
      { id: "m-jagal-1-1", name: "Sutrisno", phone: "0813-2200-1101" },
      { id: "m-jagal-1-2", name: "Yusuf Habibie" },
      { id: "m-jagal-1-3", name: "Rahmat Saputra", phone: "0813-2200-1103" },
    ],
  },
  {
    id: "team-jagal-2",
    name: "Tim Jagal 2",
    kind: "SLAUGHTER",
    leaderUserId: "user-2",
    members: [
      { id: "m-jagal-2-1", name: "Wahyu Prakoso", phone: "0813-2200-1201" },
      { id: "m-jagal-2-2", name: "Endang Supriyadi" },
    ],
  },
  {
    id: "team-jeroan-1",
    name: "Tim Jeroan 1",
    kind: "OFFAL",
    leaderUserId: "user-3",
    members: [
      { id: "m-jeroan-1-1", name: "Nur Hidayat", phone: "0813-2200-2101" },
      { id: "m-jeroan-1-2", name: "Sulastri" },
      { id: "m-jeroan-1-3", name: "Warsito" },
    ],
  },
  {
    id: "team-jeroan-2",
    name: "Tim Jeroan 2",
    kind: "OFFAL",
    leaderUserId: "user-4",
    members: [{ id: "m-jeroan-2-1", name: "Joko Purnomo", phone: "0813-2200-2201" }],
  },
  {
    id: "team-packing-1",
    name: "Tim Packing 1",
    kind: "PACKING",
    leaderUserId: "user-5",
    members: [
      { id: "m-packing-1-1", name: "Siti Nurhaliza", phone: "0813-2200-3101" },
      { id: "m-packing-1-2", name: "Ika Puspita" },
      { id: "m-packing-1-3", name: "Farhan Maulana" },
      { id: "m-packing-1-4", name: "Lestari Ningsih" },
    ],
  },
  {
    id: "team-packing-2",
    name: "Tim Packing 2",
    kind: "PACKING",
    leaderUserId: "user-6",
    members: [
      { id: "m-packing-2-1", name: "Rini Astuti", phone: "0813-2200-3201" },
      { id: "m-packing-2-2", name: "Bayu Anggara" },
    ],
  },
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