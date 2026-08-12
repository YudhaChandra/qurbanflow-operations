import type { Animal, AnimalType } from "./types";

const PREFIX: Record<AnimalType, string> = {
  SAPI: "SAPI",
  KAMBING: "KAMBING",
};

function usedNumbers(animals: Animal[], type: AnimalType, ignoreId?: string) {
  const used = new Set<number>();
  for (const animal of animals) {
    if (animal.type !== type) continue;
    if (ignoreId && animal.id === ignoreId) continue;
    const match = /(\d+)$/.exec(animal.code);
    if (match) used.add(Number(match[1]));
  }
  return used;
}

/** Smallest unused number for the type (gap filling), scoped to one event. */
export function nextAnimalCode(
  animals: Animal[],
  type: AnimalType,
  ignoreId?: string,
): string {
  const used = usedNumbers(animals, type, ignoreId);
  let candidate = 1;
  while (used.has(candidate)) candidate += 1;
  return `${PREFIX[type]} ${String(candidate).padStart(2, "0")}`;
}