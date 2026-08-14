import { useState } from "react";
import { Plus, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ANIMAL_TYPE_LABEL, STATUS_LABEL, STATUS_TONE } from "../constants";
import { animalStatus, canAddShahibul, shahibulBlocker, shahibulLimit } from "../workflow";
import { ShahibulFormDialog } from "./ShahibulFormDialog";
import type { Animal } from "../types";

export function AnimalDetailSheet({
  animal,
  open,
  onOpenChange,
}: {
  animal: Animal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const limit = shahibulLimit(animal);
  const blocker = shahibulBlocker(animal);
  const canAdd = canAddShahibul(animal);
  const status = animalStatus(animal);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-mono text-base font-bold">{animal.code}</SheetTitle>
          <SheetDescription>
            {ANIMAL_TYPE_LABEL[animal.type]} · maksimal {limit.max} shahibul
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4">
          <StatusBadge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</StatusBadge>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Shahibul ({animal.shahibul.length}/{limit.max})
            </p>
            <p className="text-xs text-muted-foreground">
              {animal.type === "KAMBING"
                ? "Kambing wajib memiliki tepat satu shahibul."
                : "Sapi dapat memiliki 1 sampai 7 shahibul."}
            </p>
          </div>
          <Button size="sm" disabled={!canAdd} onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Tambah Shahibul
          </Button>
        </div>

        {!canAdd ? (
          <p className="px-4 pb-3 text-xs text-muted-foreground">
            Kuota shahibul sudah penuh.
          </p>
        ) : null}

        {blocker ? (
          <div className="mx-4 mb-4 rounded-md border border-warning/40 bg-warning/10 px-3 py-2">
            <p className="text-xs font-medium text-foreground">{blocker}</p>
            <p className="text-xs text-muted-foreground">
              Hewan belum dapat dinyatakan lengkap.
            </p>
          </div>
        ) : null}

        <div className="px-4 pb-6">
          {animal.shahibul.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
              <Users className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Belum ada shahibul</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {animal.shahibul.map((shahibul, index) => (
                <li
                  key={shahibul.id}
                  className="rounded-md border border-border bg-card px-3 py-2"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium text-foreground">{shahibul.name}</p>
                  </div>
                  {shahibul.phone ? (
                    <p className="pl-7 font-mono text-xs text-muted-foreground">
                      {shahibul.phone}
                    </p>
                  ) : null}
                  {shahibul.notes ? (
                    <p className="pl-7 text-xs text-muted-foreground">{shahibul.notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        {addOpen ? (
          <ShahibulFormDialog animal={animal} open={addOpen} onOpenChange={setAddOpen} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
