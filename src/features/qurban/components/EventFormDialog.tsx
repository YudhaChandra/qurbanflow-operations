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
import type { QurbanEvent } from "../types";

export function EventFormDialog({
  event,
  open,
  onOpenChange,
}: {
  event?: QurbanEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addEvent, updateEvent } = useQurban();

  const [name, setName] = useState(event?.name ?? "");
  const [date, setDate] = useState(event?.date ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(event);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama event wajib diisi.");
      return;
    }
    if (!date.trim()) {
      setError("Tanggal event wajib diisi.");
      return;
    }
    if (!location.trim()) {
      setError("Lokasi event wajib diisi.");
      return;
    }

    if (isEdit && event) {
      updateEvent(event.id, {
        name: name.trim(),
        date: date.trim(),
        location: location.trim(),
        description: description.trim() || undefined,
      });
      toast.success(`Event "${name.trim()}" berhasil diperbarui`);
    } else {
      addEvent({
        name: name.trim(),
        date: date.trim(),
        location: location.trim(),
        description: description.trim() || undefined,
      });
      toast.success(`Event "${name.trim()}" berhasil dibuat (Status: Draft)`);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Ubah Event" : "Buat Event Baru"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Perbarui rincian event kurban yang masih berstatus Draft."
                : "Setiap event baru akan dimulai dengan status Draft."}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">
                Nama Event <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-name"
                placeholder="Contoh: Qurban 1448 H — Masjid Al-Ikhlas"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-date">
                Tanggal Event <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-location">
                Lokasi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-location"
                placeholder="Contoh: Lapangan Utama Masjid Al-Ikhlas, Bandung"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Deskripsi (Opsional)</Label>
              <Textarea
                id="event-description"
                placeholder="Catatan atau lingkup area operasional event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">{isEdit ? "Simpan Perubahan" : "Buat Event"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
