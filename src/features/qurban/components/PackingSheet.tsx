import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useQurban } from "../store";
import { packingBlockers, canComplete } from "../workflow";
import type { Animal } from "../types";

export function PackingSheet({
  animal,
  open,
  onOpenChange,
}: {
  animal: Animal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { recordPacking, completeWork } = useQurban();
  const responsibility = animal.responsibilities.PACKING;
  const [meat, setMeat] = useState("");
  const [offal, setOffal] = useState("");
  const [packages, setPackages] = useState(
    responsibility.packageCount?.toString() ?? "",
  );

  const totalMeat = responsibility.meatIntakes.reduce(
    (sum, intake) => sum + intake.weightKg,
    0,
  );
  const blockers = packingBlockers(responsibility);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Packing — {animal.code}</SheetTitle>
          <SheetDescription>
            Catat timbangan daging dan jeroan saat datang, lalu isi jumlah paket akhir untuk menyelesaikan.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Timbangan daging</h3>
              <span className="text-xs text-muted-foreground">
                {responsibility.meatIntakes.length} catatan · {totalMeat.toFixed(1)} kg
              </span>
            </div>
            <ul className="space-y-1">
              {responsibility.meatIntakes.map((intake) => (
                <li
                  key={intake.id}
                  className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-1.5 text-xs"
                >
                  <span className="font-mono">{intake.weightKg.toFixed(1)} kg</span>
                  <span className="text-muted-foreground">{intake.recordedAt}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Label htmlFor="meat">Tambah timbangan (kg)</Label>
                <Input
                  id="meat"
                  inputMode="decimal"
                  value={meat}
                  onChange={(e) => setMeat(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <Button
                variant="secondary"
                disabled={!Number(meat)}
                onClick={() => {
                  recordPacking(animal.id, { type: "MEAT", weightKg: Number(meat) });
                  setMeat("");
                }}
              >
                <Plus className="size-4" /> Tambah
              </Button>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-sm font-medium">Timbangan jeroan</h3>
            {responsibility.offalIntake ? (
              <div className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-1.5 text-xs">
                <span className="font-mono">
                  {responsibility.offalIntake.weightKg.toFixed(1)} kg
                </span>
                <span className="text-muted-foreground">
                  {responsibility.offalIntake.recordedAt}
                </span>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="offal">Timbangan (kg)</Label>
                  <Input
                    id="offal"
                    inputMode="decimal"
                    value={offal}
                    onChange={(e) => setOffal(e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <Button
                  variant="secondary"
                  disabled={!Number(offal)}
                  onClick={() => {
                    recordPacking(animal.id, { type: "OFFAL", weightKg: Number(offal) });
                    setOffal("");
                  }}
                >
                  Catat
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Satu catatan timbangan jeroan per hewan.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-sm font-medium">Jumlah paket akhir</h3>
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Label htmlFor="packages">Paket</Label>
                <Input
                  id="packages"
                  inputMode="numeric"
                  value={packages}
                  onChange={(e) => setPackages(e.target.value)}
                  placeholder="0"
                />
              </div>
              <Button
                variant="secondary"
                disabled={!Number(packages)}
                onClick={() =>
                  recordPacking(animal.id, {
                    type: "PACKAGE_COUNT",
                    count: Number(packages),
                  })
                }
              >
                Simpan
              </Button>
            </div>
          </section>

          <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
            {blockers.length > 0 ? (
              <>
                <p className="text-xs font-medium">Wajib sebelum menyelesaikan</p>
                <ul className="list-inside list-disc text-xs text-muted-foreground">
                  {blockers.map((blocker) => (
                    <li key={blocker}>{blocker}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Semua catatan packing lengkap.
              </p>
            )}
            <Button
              className="w-full"
              disabled={!canComplete(responsibility)}
              onClick={() => {
                completeWork(animal.id, "PACKING");
                onOpenChange(false);
                toast.success(`${animal.code} packing selesai`);
              }}
            >
              Selesaikan packing
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}