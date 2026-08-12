import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQurban } from "../store";
import { nextAnimalCode } from "../identifier";
import { ANIMAL_TYPE_LABEL } from "../constants";
import type { Animal, AnimalType } from "../types";

export function AnimalFormDialog({
  animal,
  open,
  onOpenChange,
}: {
  animal?: Animal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { animals, addAnimal, updateAnimalType } = useQurban();
  const [type, setType] = useState<AnimalType>(animal?.type ?? "SAPI");
  const isEdit = Boolean(animal);
  const previewCode =
    isEdit && animal!.type === type
      ? animal!.code
      : nextAnimalCode(animals, type, animal?.id);

  const handleSubmit = () => {
    if (isEdit) {
      updateAnimalType(animal!.id, type);
      toast.success(`Hewan diperbarui — ${previewCode}`);
    } else {
      addAnimal(type);
      toast.success(`Hewan ditambahkan — ${previewCode}`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Ubah Hewan" : "Tambah Hewan"}</DialogTitle>
          <DialogDescription>
            Identitas hewan dibuat otomatis dan tidak dapat diubah manual.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animal-type">Jenis hewan</Label>
            <Select value={type} onValueChange={(value) => setType(value as AnimalType)}>
              <SelectTrigger id="animal-type">
                <SelectValue placeholder="Pilih jenis hewan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAPI">{ANIMAL_TYPE_LABEL.SAPI}</SelectItem>
                <SelectItem value="KAMBING">{ANIMAL_TYPE_LABEL.KAMBING}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 rounded-md border border-border bg-surface px-3 py-2">
            <p className="text-xs text-muted-foreground">Identitas hewan (otomatis)</p>
            <p className="font-mono text-base font-bold text-foreground">{previewCode}</p>
            <p className="text-xs text-muted-foreground">
              {type === "SAPI"
                ? "Sapi dapat memiliki beberapa shahibul."
                : "Kambing memiliki tepat satu shahibul."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Simpan" : "Tambah hewan"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}