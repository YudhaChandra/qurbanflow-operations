export type AnimalType = "SAPI" | "KAMBING";

export type ResponsibilityKind = "SLAUGHTER" | "OFFAL" | "PACKING";

export type WorkflowStatus =
  | "BELUM_DITUGASKAN"
  | "SUDAH_DITUGASKAN"
  | "SEDANG_DIKERJAKAN"
  | "SELESAI";

export type Team = {
  id: string;
  name: string;
  kind: ResponsibilityKind;
  leaderUserId: string;
  members: TeamMember[];
};

export type UserRole = "SUPER_ADMIN" | "SUPERVISOR" | "KETUA_TIM";
export type UserStatus = "PENDING" | "AKTIF" | "NONAKTIF";

/** System user that can lead an operational team or supervise events. */
export type SystemUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

/** Team member — not a system user, stored on the team only. */
export type TeamMember = {
  id: string;
  name: string;
  phone?: string;
};

export type MeatIntake = {
  id: string;
  weightKg: number;
  recordedAt: string;
};

export type OffalIntake = {
  weightKg: number;
  recordedAt: string;
};

export type Shahibul = {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
};

export type Responsibility = {
  kind: ResponsibilityKind;
  status: WorkflowStatus;
  teamId: string | null;
  /** Packing only. */
  meatIntakes: MeatIntake[];
  offalIntake: OffalIntake | null;
  packageCount: number | null;
};

export type Animal = {
  id: string;
  code: string;
  type: AnimalType;
  shahibul: Shahibul[];
  responsibilities: Record<ResponsibilityKind, Responsibility>;
};

export type EventStatus = "DRAFT" | "AKTIF" | "SELESAI";

export type QurbanEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
  description?: string;
  status: EventStatus;
  completed?: boolean;
};

/** One board card = one animal x one responsibility. */
export type BoardCard = {
  animal: Animal;
  responsibility: Responsibility;
  team: Team | null;
};