import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Animal,
  AnimalType,
  QurbanEvent,
  Responsibility,
  ResponsibilityKind,
  Shahibul,
  Team,
} from "./types";
import { createMockAnimals, mockEvent, mockTeams } from "./mock-data";
import { RESPONSIBILITY_ORDER, SHAHIBUL_LIMIT } from "./constants";
import { canComplete } from "./workflow";
import { nextAnimalCode } from "./identifier";

type PackingRecord =
  | { type: "MEAT"; weightKg: number }
  | { type: "OFFAL"; weightKg: number }
  | { type: "PACKAGE_COUNT"; count: number };

type QurbanContextValue = {
  event: QurbanEvent;
  animals: Animal[];
  teams: Team[];
  teamsFor: (kind: ResponsibilityKind) => Team[];
  addAnimal: (type: AnimalType) => void;
  updateAnimalType: (animalId: string, type: AnimalType) => void;
  addShahibul: (animalId: string, input: Omit<Shahibul, "id">) => void;
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
  const [event, setEvent] = useState<QurbanEvent>(mockEvent);
  const [animals, setAnimals] = useState<Animal[]>(() => createMockAnimals());

  const update = useCallback(
    (
      animalId: string,
      kind: ResponsibilityKind,
      updater: (responsibility: Responsibility) => Responsibility,
    ) => {
      setAnimals((current) =>
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
    [],
  );

  const addAnimal = useCallback((type: AnimalType) => {
    setAnimals((current) => {
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
  }, []);

  const updateAnimalType = useCallback((animalId: string, type: AnimalType) => {
    setAnimals((current) =>
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
  }, []);

  const addShahibul = useCallback(
    (animalId: string, input: Omit<Shahibul, "id">) => {
      setAnimals((current) =>
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
    [],
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
      animals.reduce(
        (total, animal) =>
          total +
          RESPONSIBILITY_ORDER.filter(
            (kind) => animal.responsibilities[kind].status !== "SELESAI",
          ).length,
        0,
      ),
    [animals],
  );

  const completeEvent = useCallback(() => {
    if (outstandingResponsibilities > 0) return;
    setEvent((current) => ({ ...current, completed: true }));
  }, [outstandingResponsibilities]);

  const teamsFor = useCallback(
    (kind: ResponsibilityKind) => mockTeams.filter((team) => team.kind === kind),
    [],
  );

  const value = useMemo<QurbanContextValue>(
    () => ({
      event,
      animals,
      teams: mockTeams,
      teamsFor,
      addAnimal,
      updateAnimalType,
      addShahibul,
      assignTeam,
      startWork,
      completeWork,
      recordPacking,
      completeEvent,
      outstandingResponsibilities,
    }),
    [
      event,
      animals,
      teamsFor,
      addAnimal,
      updateAnimalType,
      addShahibul,
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