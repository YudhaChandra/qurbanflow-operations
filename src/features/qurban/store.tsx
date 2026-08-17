import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Animal,
  AnimalType,
  EventStatus,
  QurbanEvent,
  Responsibility,
  ResponsibilityKind,
  Shahibul,
  SystemUser,
  Team,
  UserRole,
  TeamMember,
} from "./types";
import { createMockAnimals, mockEvents, mockTeams } from "./mock-data";
import { supabase } from "@/lib/supabase";
import { RESPONSIBILITY_ORDER, SHAHIBUL_LIMIT } from "./constants";
import { canComplete } from "./workflow";
import { nextAnimalCode } from "./identifier";
import { nextTeamName } from "./team-identifier";

type PackingRecord =
  | { type: "MEAT"; weightKg: number }
  | { type: "OFFAL"; weightKg: number }
  | { type: "PACKAGE_COUNT"; count: number };

type EventInput = {
  name: string;
  date: string;
  location: string;
  description?: string;
};

type QurbanContextValue = {
  events: QurbanEvent[];
  event: QurbanEvent;
  activeEvent: QurbanEvent | null;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  addEvent: (input: EventInput) => void;
  updateEvent: (eventId: string, input: EventInput) => void;
  activateEvent: (eventId: string) => { success: boolean; message?: string };
  finishEvent: (eventId: string) => { success: boolean; message?: string };
  isReadOnly: boolean;
  getEventStats: (eventId: string) => { animalCount: number; teamCount: number };

  animals: Animal[];
  teams: Team[];
  users: SystemUser[];
  usersLoaded: boolean;
  addUser: (input: {
    name: string;
    email: string;
    role: "SUPERVISOR" | "KETUA_TIM";
  }) => { success: boolean; message?: string };
  updateUser: (
    userId: string,
    input: { name: string; email?: string; role: UserRole },
  ) => { success: boolean; message?: string };
  setUserStatus: (
    userId: string,
    status: "AKTIF" | "NONAKTIF",
  ) => { success: boolean; message?: string };
  activateUser: (userId: string) => { success: boolean; message?: string };
  teamsFor: (kind: ResponsibilityKind) => Team[];
  addTeam: (input: { kind: ResponsibilityKind; leaderUserId: string }) => void;
  updateTeam: (
    teamId: string,
    input: { kind: ResponsibilityKind; leaderUserId: string },
  ) => void;
  deleteTeam: (teamId: string) => void;
  addMember: (teamId: string, input: Omit<TeamMember, "id">) => void;
  updateMember: (
    teamId: string,
    memberId: string,
    input: Omit<TeamMember, "id">,
  ) => void;
  removeMember: (teamId: string, memberId: string) => void;
  addAnimal: (type: AnimalType) => void;
  updateAnimalType: (animalId: string, type: AnimalType) => void;
  addShahibul: (animalId: string, input: Omit<Shahibul, "id">) => void;
  updateShahibul: (animalId: string, shahibulId: string, input: Omit<Shahibul, "id">) => void;
  removeShahibul: (animalId: string, shahibulId: string) => void;
  assignTeam: (animalId: string, kind: ResponsibilityKind, teamId: string) => void;
  startWork: (animalId: string, kind: ResponsibilityKind) => void;
  completeWork: (animalId: string, kind: ResponsibilityKind) => void;
  recordPacking: (animalId: string, record: PackingRecord) => void;
  completeEvent: () => void;
  outstandingResponsibilities: number;
};

const QurbanContext = createContext<QurbanContextValue | null>(null);

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function QurbanProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<QurbanEvent[]>(mockEvents);
  const [selectedEventId, setSelectedEventId] = useState<string>("evt-1");

  const [eventsAnimals, setEventsAnimals] = useState<Record<string, Animal[]>>({
    "evt-1": createMockAnimals(),
    "evt-2": [],
    "evt-3": [],
  });

  const [eventsTeams, setEventsTeams] = useState<Record<string, Team[]>>({
    "evt-1": mockTeams,
    "evt-2": [],
    "evt-3": [],
  });

  const [users, setUsers] = useState<SystemUser[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, status, created_at")
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Gagal mengambil pengguna dari Supabase:", error);
        setUsersLoaded(true);
        return;
      }

      const mappedUsers: SystemUser[] = (data ?? []).map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as SystemUser["role"],
        status: user.status as SystemUser["status"],
        createdAt: user.created_at,
      }));

      setUsers(mappedUsers);
      setUsersLoaded(true);
    };

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? events[0],
    [events, selectedEventId],
  );

  const activeEvent = useMemo(
    () => events.find((e) => e.status === "AKTIF") ?? null,
    [events],
  );

  const isReadOnly = currentEvent.status === "SELESAI";

  const currentAnimals = useMemo(
    () => eventsAnimals[currentEvent.id] ?? [],
    [eventsAnimals, currentEvent.id],
  );

  const currentTeams = useMemo(
    () => eventsTeams[currentEvent.id] ?? [],
    [eventsTeams, currentEvent.id],
  );

  const setAnimalsForCurrent = useCallback(
    (updater: (prev: Animal[]) => Animal[]) => {
      setEventsAnimals((prev) => ({
        ...prev,
        [currentEvent.id]: updater(prev[currentEvent.id] ?? []),
      }));
    },
    [currentEvent.id],
  );

  const setTeamsForCurrent = useCallback(
    (updater: (prev: Team[]) => Team[]) => {
      setEventsTeams((prev) => ({
        ...prev,
        [currentEvent.id]: updater(prev[currentEvent.id] ?? []),
      }));
    },
    [currentEvent.id],
  );

  const getEventStats = useCallback(
    (eventId: string) => {
      const animalCount = (eventsAnimals[eventId] ?? []).length;
      const teamCount = (eventsTeams[eventId] ?? []).length;
      return { animalCount, teamCount };
    },
    [eventsAnimals, eventsTeams],
  );

  const addEvent = useCallback((input: EventInput) => {
    const newId = `evt-${Date.now()}`;
    const newEvent: QurbanEvent = {
      id: newId,
      name: input.name,
      date: input.date,
      location: input.location,
      description: input.description,
      status: "DRAFT",
      completed: false,
    };
    setEvents((prev) => [newEvent, ...prev]);
    setEventsAnimals((prev) => ({ ...prev, [newId]: [] }));
    setEventsTeams((prev) => ({ ...prev, [newId]: [] }));
    setSelectedEventId(newId);
  }, []);

  const updateEvent = useCallback((eventId: string, input: EventInput) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        if (e.status !== "DRAFT") return e;
        return {
          ...e,
          name: input.name,
          date: input.date,
          location: input.location,
          description: input.description,
        };
      }),
    );
  }, []);

  const activateEvent = useCallback(
    (eventId: string) => {
      const targetEvent = events.find((e) => e.id === eventId);
      if (!targetEvent) {
        return { success: false, message: "Event tidak ditemukan." };
      }
      if (targetEvent.status !== "DRAFT") {
        return { success: false, message: "Hanya event berstatus Draft yang dapat diaktifkan." };
      }

      const animalCount = (eventsAnimals[eventId] ?? []).length;
      const teamCount = (eventsTeams[eventId] ?? []).length;

      if (animalCount === 0 || teamCount === 0) {
        return {
          success: false,
          message:
            "Event tidak dapat diaktifkan. Event harus memiliki setidaknya 1 Hewan Kurban dan 1 Tim Operasional.",
        };
      }

      const existingActive = events.find((e) => e.id !== eventId && e.status === "AKTIF");
      if (existingActive) {
        return {
          success: false,
          message: `Tidak dapat mengaktifkan event. Mohon selesaikan event yang sedang aktif ("${existingActive.name}") terlebih dahulu.`,
        };
      }

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: "AKTIF" } : e)),
      );

      return { success: true };
    },
    [events, eventsAnimals, eventsTeams],
  );

  const finishEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, status: "SELESAI", completed: true } : e,
      ),
    );
    return { success: true };
  }, []);

  const checkUserTeamLeaderAssignment = useCallback(
    (userId: string) => {
      const activeOrDraftEvents = events.filter(
        (e) => e.status === "AKTIF" || e.status === "DRAFT",
      );
      for (const evt of activeOrDraftEvents) {
        const teams = eventsTeams[evt.id] ?? [];
        if (teams.some((t) => t.leaderUserId === userId)) {
          return { isAssigned: true, eventName: evt.name };
        }
      }
      return { isAssigned: false, eventName: null };
    },
    [events, eventsTeams],
  );

  const addUser = useCallback(
    (input: { name: string; email: string; role: "SUPERVISOR" | "KETUA_TIM" }) => {
      const normalizedEmail = input.email.trim().toLowerCase();
      const exists = users.some((u) => u.email.trim().toLowerCase() === normalizedEmail);
      if (exists) {
        return {
          success: false,
          message: "Email sudah terdaftar. Gunakan alamat email lain.",
        };
      }

      const newId = `user-${Date.now()}`;
      const newUser: SystemUser = {
        id: newId,
        name: input.name.trim(),
        email: normalizedEmail,
        role: input.role,
        status: "PENDING",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setUsers((prev) => [...prev, newUser]);

      void supabase.from("users").insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        created_at: newUser.createdAt,
      }).then(({ error }) => {
        if (error) {
          console.error("Gagal menyimpan pengguna baru ke Supabase:", error);
        }
      });

      return { success: true };
    },
    [users],
  );

  const updateUser = useCallback(
    (
      userId: string,
      input: { name: string; email?: string; role: UserRole },
    ) => {
      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, message: "Pengguna tidak ditemukan." };

      if (target.role === "SUPER_ADMIN") {
        return {
          success: false,
          message: "Akun Super Admin tidak dapat diubah.",
        };
      }

      if (target.status === "PENDING" && input.email) {
        const normalizedEmail = input.email.trim().toLowerCase();
        const exists = users.some(
          (u) => u.id !== userId && u.email.trim().toLowerCase() === normalizedEmail,
        );
        if (exists) {
          return {
            success: false,
            message: "Email sudah terdaftar. Gunakan alamat email lain.",
          };
        }
      }

      if (input.role !== target.role) {
        if (target.role === "SUPERVISOR" && input.role !== "SUPERVISOR") {
          const activeSupervisors = users.filter(
            (u) => u.role === "SUPERVISOR" && u.status === "AKTIF",
          );
          if (activeSupervisors.length <= 1 && target.status === "AKTIF") {
            return {
              success: false,
              message:
                "Tidak dapat mengubah peran. Sistem harus memiliki setidaknya 1 Supervisor aktif.",
            };
          }
        }

        const assignment = checkUserTeamLeaderAssignment(userId);
        if (assignment.isAssigned) {
          return {
            success: false,
            message: `Tidak dapat mengubah peran. ${target.name} saat ini bertugas sebagai Ketua Tim di event "${assignment.eventName}". Ganti ketua tim terlebih dahulu.`,
          };
        }
      }

      const nextName = input.name.trim();
      const nextEmail =
        target.status === "PENDING" && input.email
          ? input.email.trim().toLowerCase()
          : target.email;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, name: nextName, email: nextEmail, role: input.role }
            : u,
        ),
      );

      void supabase
        .from("users")
        .update({
          name: nextName,
          email: nextEmail,
          role: input.role,
        })
        .eq("id", userId)
        .then(({ error }) => {
          if (error) {
            console.error("Gagal menyimpan perubahan pengguna ke Supabase:", error);
          }
        });

      return { success: true };
    },
    [users, checkUserTeamLeaderAssignment],
  );

  const setUserStatus = useCallback(
    (userId: string, nextStatus: "AKTIF" | "NONAKTIF") => {
      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, message: "Pengguna tidak ditemukan." };

      if (target.role === "SUPER_ADMIN") {
        return {
          success: false,
          message: "Akun Super Admin tidak dapat dinonaktifkan atau diubah statusnya.",
        };
      }

      if (target.status === "PENDING" && nextStatus === "AKTIF") {
        return {
          success: false,
          message:
            "Pengguna dengan status Pending tidak dapat diaktifkan secara manual. Status akan berubah otomatis saat login Google pertama.",
        };
      }

      if (nextStatus === "NONAKTIF") {
        if (target.role === "SUPERVISOR") {
          const activeSupervisors = users.filter(
            (u) => u.role === "SUPERVISOR" && u.status === "AKTIF",
          );
          if (activeSupervisors.length <= 1) {
            return {
              success: false,
              message:
                "Tidak dapat menonaktifkan pengguna. Sistem harus memiliki setidaknya 1 Supervisor aktif.",
            };
          }
        }

        const assignment = checkUserTeamLeaderAssignment(userId);
        if (assignment.isAssigned) {
          return {
            success: false,
            message: `Tidak dapat menonaktifkan pengguna. ${target.name} saat ini bertugas sebagai Ketua Tim di event "${assignment.eventName}". Ganti ketua tim terlebih dahulu.`,
          };
        }
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)),
      );

      void supabase
        .from("users")
        .update({ status: nextStatus })
        .eq("id", userId)
        .then(({ error }) => {
          if (error) {
            console.error("Gagal mengubah status pengguna di Supabase:", error);
          }
        });

      return { success: true };
    },
    [users, checkUserTeamLeaderAssignment],
  );

  // Business method: called by AuthContext on first login (Pending → Aktif)
  const activateUser = useCallback(
    (userId: string) => {
      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, message: "Pengguna tidak ditemukan." };
      if (target.status !== "PENDING") return { success: true }; // already active
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "AKTIF" as const } : u)),
      );

      void supabase
        .from("users")
        .update({ status: "AKTIF" })
        .eq("id", userId)
        .then(({ error }) => {
          if (error) {
            console.error("Gagal mengaktifkan pengguna di Supabase:", error);
          }
        });

      return { success: true };
    },
    [users],
  );

  const update = useCallback(
    (
      animalId: string,
      kind: ResponsibilityKind,
      updater: (responsibility: Responsibility) => Responsibility,
    ) => {
      setAnimalsForCurrent((current) =>
        current.map((animal) =>
          animal.id === animalId
            ? {
              ...animal,
              responsibilities: {
                ...animal.responsibilities,
                [kind]: updater(animal.responsibilities[kind]),
              },
            }
            : animal,
        ),
      );
    },
    [setAnimalsForCurrent],
  );

  const addAnimal = useCallback(
    (type: AnimalType) => {
      setAnimalsForCurrent((current) => {
        const code = nextAnimalCode(current, type);
        const id = `animal-${Date.now()}`;
        const responsibilities = {} as Animal["responsibilities"];
        for (const kind of RESPONSIBILITY_ORDER) {
          responsibilities[kind] = {
            kind,
            status: "BELUM_DITUGASKAN",
            teamId: null,
            meatIntakes: [],
            offalIntake: null,
            packageCount: null,
          };
        }
        return [...current, { id, code, type, shahibul: [], responsibilities }];
      });
    },
    [setAnimalsForCurrent],
  );

  const updateAnimalType = useCallback(
    (animalId: string, type: AnimalType) => {
      setAnimalsForCurrent((current) =>
        current.map((animal) => {
          if (animal.id !== animalId || animal.type === type) return animal;
          return {
            ...animal,
            type,
            code: nextAnimalCode(current, type, animalId),
            shahibul: animal.shahibul.slice(0, SHAHIBUL_LIMIT[type].max),
          };
        }),
      );
    },
    [setAnimalsForCurrent],
  );

  const addShahibul = useCallback(
    (animalId: string, input: Omit<Shahibul, "id">) => {
      setAnimalsForCurrent((current) =>
        current.map((animal) => {
          if (animal.id !== animalId) return animal;
          if (animal.shahibul.length >= SHAHIBUL_LIMIT[animal.type].max) return animal;
          return {
            ...animal,
            shahibul: [
              ...animal.shahibul,
              { id: `${animalId}-shahibul-${Date.now()}`, ...input },
            ],
          };
        }),
      );
    },
    [setAnimalsForCurrent],
  );

  const updateShahibul = useCallback(
    (animalId: string, shahibulId: string, input: Omit<Shahibul, "id">) => {
      setAnimalsForCurrent((current) =>
        current.map((animal) =>
          animal.id === animalId
            ? {
              ...animal,
              shahibul: animal.shahibul.map((item) =>
                item.id === shahibulId ? { id: item.id, ...input } : item,
              ),
            }
            : animal,
        ),
      );
    },
    [setAnimalsForCurrent],
  );

  const removeShahibul = useCallback(
    (animalId: string, shahibulId: string) => {
      setAnimalsForCurrent((current) =>
        current.map((animal) =>
          animal.id === animalId
            ? {
              ...animal,
              shahibul: animal.shahibul.filter((item) => item.id !== shahibulId),
            }
            : animal,
        ),
      );
    },
    [setAnimalsForCurrent],
  );

  const assignTeam = useCallback(
    (animalId: string, kind: ResponsibilityKind, teamId: string) =>
      update(animalId, kind, (responsibility) =>
        responsibility.status === "SELESAI"
          ? responsibility
          : {
            ...responsibility,
            teamId,
            status:
              responsibility.status === "BELUM_DITUGASKAN"
                ? "SUDAH_DITUGASKAN"
                : responsibility.status,
          },
      ),
    [update],
  );

  const startWork = useCallback(
    (animalId: string, kind: ResponsibilityKind) =>
      update(animalId, kind, (responsibility) =>
        responsibility.status === "SUDAH_DITUGASKAN"
          ? { ...responsibility, status: "SEDANG_DIKERJAKAN" }
          : responsibility,
      ),
    [update],
  );

  const completeWork = useCallback(
    (animalId: string, kind: ResponsibilityKind) =>
      update(animalId, kind, (responsibility) =>
        canComplete(responsibility)
          ? { ...responsibility, status: "SELESAI" }
          : responsibility,
      ),
    [update],
  );

  const recordPacking = useCallback(
    (animalId: string, record: PackingRecord) =>
      update(animalId, "PACKING", (responsibility) => {
        if (responsibility.status !== "SEDANG_DIKERJAKAN") return responsibility;
        if (record.type === "MEAT") {
          return {
            ...responsibility,
            meatIntakes: [
              ...responsibility.meatIntakes,
              {
                id: `${animalId}-meat-${responsibility.meatIntakes.length + 1}-${Date.now()}`,
                weightKg: record.weightKg,
                recordedAt: nowLabel(),
              },
            ],
          };
        }
        if (record.type === "OFFAL") {
          return {
            ...responsibility,
            offalIntake: { weightKg: record.weightKg, recordedAt: nowLabel() },
          };
        }
        return { ...responsibility, packageCount: record.count };
      }),
    [update],
  );

  const outstandingResponsibilities = useMemo(
    () =>
      currentAnimals.reduce(
        (total, animal) =>
          total +
          RESPONSIBILITY_ORDER.filter(
            (kind) => animal.responsibilities[kind].status !== "SELESAI",
          ).length,
        0,
      ),
    [currentAnimals],
  );

  const completeEvent = useCallback(() => {
    if (outstandingResponsibilities > 0) return;
    finishEvent(currentEvent.id);
  }, [outstandingResponsibilities, finishEvent, currentEvent.id]);

  const teamsFor = useCallback(
    (kind: ResponsibilityKind) => currentTeams.filter((team) => team.kind === kind),
    [currentTeams],
  );

  const addTeam = useCallback(
    (input: { kind: ResponsibilityKind; leaderUserId: string }) => {
      setTeamsForCurrent((current) => [
        ...current,
        {
          id: `team-${Date.now()}`,
          name: nextTeamName(current, input.kind),
          kind: input.kind,
          leaderUserId: input.leaderUserId,
          members: [],
        },
      ]);
    },
    [setTeamsForCurrent],
  );

  const updateTeam = useCallback(
    (teamId: string, input: { kind: ResponsibilityKind; leaderUserId: string }) => {
      setTeamsForCurrent((current) =>
        current.map((team) => {
          if (team.id !== teamId) return team;
          return {
            ...team,
            kind: input.kind,
            leaderUserId: input.leaderUserId,
            name:
              team.kind === input.kind
                ? team.name
                : nextTeamName(current, input.kind, teamId),
          };
        }),
      );
    },
    [setTeamsForCurrent],
  );

  const addMember = useCallback(
    (teamId: string, input: Omit<TeamMember, "id">) => {
      setTeamsForCurrent((current) =>
        current.map((team) =>
          team.id === teamId
            ? {
              ...team,
              members: [
                ...team.members,
                { id: `${teamId}-member-${Date.now()}`, ...input },
              ],
            }
            : team,
        ),
      );
    },
    [setTeamsForCurrent],
  );

  const updateMember = useCallback(
    (teamId: string, memberId: string, input: Omit<TeamMember, "id">) => {
      setTeamsForCurrent((current) =>
        current.map((team) =>
          team.id === teamId
            ? {
              ...team,
              members: team.members.map((member) =>
                member.id === memberId ? { id: member.id, ...input } : member,
              ),
            }
            : team,
        ),
      );
    },
    [setTeamsForCurrent],
  );

  const removeMember = useCallback(
    (teamId: string, memberId: string) => {
      setTeamsForCurrent((current) =>
        current.map((team) =>
          team.id === teamId
            ? { ...team, members: team.members.filter((m) => m.id !== memberId) }
            : team,
        ),
      );
    },
    [setTeamsForCurrent],
  );

  const deleteTeam = useCallback(
    (teamId: string) => {
      setTeamsForCurrent((current) => current.filter((team) => team.id !== teamId));
      setAnimalsForCurrent((current) =>
        current.map((animal) => {
          let modified = false;
          const responsibilities = { ...animal.responsibilities };
          for (const kind of RESPONSIBILITY_ORDER) {
            if (responsibilities[kind].teamId === teamId) {
              modified = true;
              responsibilities[kind] = {
                ...responsibilities[kind],
                teamId: null,
                status:
                  responsibilities[kind].status === "SUDAH_DITUGASKAN"
                    ? "BELUM_DITUGASKAN"
                    : responsibilities[kind].status,
              };
            }
          }
          return modified ? { ...animal, responsibilities } : animal;
        }),
      );
    },
    [setTeamsForCurrent, setAnimalsForCurrent],
  );

  const value = useMemo<QurbanContextValue>(
    () => ({
      events,
      event: currentEvent,
      activeEvent,
      selectedEventId,
      setSelectedEventId,
      addEvent,
      updateEvent,
      activateEvent,
      finishEvent,
      isReadOnly,
      getEventStats,
      animals: currentAnimals,
      teams: currentTeams,
      users,
      usersLoaded,
      addUser,
      updateUser,
      setUserStatus,
      activateUser,
      teamsFor,
      addTeam,
      updateTeam,
      deleteTeam,
      addMember,
      updateMember,
      removeMember,
      addAnimal,
      updateAnimalType,
      addShahibul,
      updateShahibul,
      removeShahibul,
      assignTeam,
      startWork,
      completeWork,
      recordPacking,
      completeEvent,
      outstandingResponsibilities,
    }),
    [
      events,
      currentEvent,
      activeEvent,
      selectedEventId,
      setSelectedEventId,
      addEvent,
      updateEvent,
      activateEvent,
      finishEvent,
      isReadOnly,
      getEventStats,
      currentAnimals,
      currentTeams,
      users,
      usersLoaded,
      addUser,
      updateUser,
      setUserStatus,
      activateUser,
      teamsFor,
      addTeam,
      updateTeam,
      deleteTeam,
      addMember,
      updateMember,
      removeMember,
      addAnimal,
      updateAnimalType,
      addShahibul,
      updateShahibul,
      removeShahibul,
      assignTeam,
      startWork,
      completeWork,
      recordPacking,
      completeEvent,
      outstandingResponsibilities,
    ],
  );

  return <QurbanContext.Provider value={value}>{children}</QurbanContext.Provider>;
}

export function useQurban() {
  const context = useContext(QurbanContext);
  if (!context) throw new Error("useQurban must be used inside QurbanProvider");
  return context;
}