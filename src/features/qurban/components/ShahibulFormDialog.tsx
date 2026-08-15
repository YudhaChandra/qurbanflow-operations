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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQurban } from "../store";
import type { Animal, Shahibul } from "../types";

export function ShahibulFormDialog({
  animal,
  shahibul,
  open,
  onOpenChange,
}: {
  animal: Animal;
  shahibul?: Shahibul;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addShahibul, updateShahibul } = useQurban();
  const [name, setName] = useState(shahibul?.name ?? "");
  const [phone, setPhone] = useState(shahibul?.phone ?? "");
  const [notes, setNotes] = useState(shahibul?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(shahibul);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Nama shahibul wajib diisi.");
      return;
    }
    if (trimmed.length > 100) {
      setError("Nama shahibul maksimal 100 karakter.");
      return;
    }
    const payload = {
      name: trimmed,
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };
    if (shahibul) {
      updateShahibul(animal.id, shahibul.id, payload);
      toast.success(`Shahibul diperbarui — ${animal.code}`);
    } else {
      addShahibul(animal.id, payload);
      toast.success(`Shahibul ditambahkan — ${animal.code}`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Ubah Shahibul" : "Tambah Shahibul"}</DialogTitle>
          <DialogDescription>
            Shahibul dicatat langsung pada hewan {animal.code}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shahibul-name">Nama shahibul</Label>
            <Input
              id="shahibul-name"
              value={name}
              maxLength={100}
              placeholder="Contoh: H. Ahmad Fauzi"
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shahibul-phone">Nomor HP (opsional)</Label>
            <Input
              id="shahibul-phone"
              value={phone}
              maxLength={25}
              inputMode="tel"
              placeholder="08xx-xxxx-xxxx"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shahibul-notes">Catatan (opsional)</Label>
            <Textarea
              id="shahibul-notes"
              value={notes}
              maxLength={300}
              rows={3}
              placeholder="Catatan operasional"
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
