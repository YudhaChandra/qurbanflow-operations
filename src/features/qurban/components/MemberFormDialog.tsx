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
import { useQurban } from "../store";
import { findPersonConflict } from "../team-rules";
import type { Team, TeamMember } from "../types";

export function MemberFormDialog({
  team,
  member,
  open,
  onOpenChange,
}: {
  team: Team;
  member?: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { teams, users, addMember, updateMember } = useQurban();
  const [name, setName] = useState(member?.name ?? "");
  const [phone, setPhone] = useState(member?.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(member);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (trimmed.length > 100) {
      setError("Nama lengkap maksimal 100 karakter.");
      return;
    }
    const conflict = findPersonConflict(teams, users, trimmed, {
      withinTeamId: team.id,
      ...(member ? { ignoreMemberId: member.id } : {}),
    });
    if (conflict) {
      setError(
        conflict.id === team.id
          ? `${trimmed} sudah terdaftar di tim ini.`
          : `${trimmed} sudah terdaftar di ${conflict.name}. Satu orang hanya boleh berada di satu tim operasional.`,
      );
      return;
    }
    const payload = { name: trimmed, ...(phone.trim() ? { phone: phone.trim() } : {}) };
    if (member) {
      updateMember(team.id, member.id, payload);
      toast.success(`Anggota diperbarui — ${team.name}`);
    } else {
      addMember(team.id, payload);
      toast.success(`${trimmed} ditambahkan ke ${team.name}`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Ubah Anggota" : "Tambah Anggota"}</DialogTitle>
          <DialogDescription>{team.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-name">
              Nama lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="member-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Nama anggota tim"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-phone">Nomor HP (opsional)</Label>
            <Input
              id="member-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xx-xxxx-xxxx"
            />
          </div>
          {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Simpan" : "Tambah"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}