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
import { RESPONSIBILITY_LABEL, RESPONSIBILITY_ORDER } from "../constants";
import { nextTeamName } from "../team-identifier";
import { findPersonConflict, userName } from "../team-rules";
import type { ResponsibilityKind, Team } from "../types";

export function TeamFormDialog({
  team,
  open,
  onOpenChange,
}: {
  team?: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { teams, users, addTeam, updateTeam } = useQurban();
  const [kind, setKind] = useState<ResponsibilityKind>(team?.kind ?? "SLAUGHTER");
  const [leaderUserId, setLeaderUserId] = useState(team?.leaderUserId ?? "");
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(team);

  const generatedName = isEdit
    ? team!.kind === kind
      ? team!.name
      : nextTeamName(teams, kind, team!.id)
    : nextTeamName(teams, kind);

  const handleSubmit = () => {
    if (!leaderUserId) {
      setError("Ketua tim wajib dipilih.");
      return;
    }
    const conflict = findPersonConflict(teams, users, userName(users, leaderUserId), {
      ...(team ? { withinTeamId: team.id } : {}),
    });
    if (conflict) {
      setError(
        `${userName(users, leaderUserId)} sudah terdaftar di ${conflict.name}. Satu orang hanya boleh berada di satu tim operasional.`,
      );
      return;
    }
    if (team) {
      updateTeam(team.id, { kind, leaderUserId });
      toast.success(`${generatedName} diperbarui`);
    } else {
      addTeam({ kind, leaderUserId });
      toast.success(`${generatedName} ditambahkan`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Ubah Tim" : "Tambah Tim"}</DialogTitle>
          <DialogDescription>
            Nama tim dibuat otomatis mengikuti kategori tim.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-kind">Kategori tim</Label>
            <Select
              value={kind}
              onValueChange={(value) => {
                setKind(value as ResponsibilityKind);
                setError(null);
              }}
            >
              <SelectTrigger id="team-kind">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESPONSIBILITY_ORDER.map((item) => (
                  <SelectItem key={item} value={item}>
                    {RESPONSIBILITY_LABEL[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-leader">Ketua tim</Label>
            <Select
              value={leaderUserId}
              onValueChange={(value) => {
                setLeaderUserId(value);
                setError(null);
              }}
            >
              <SelectTrigger id="team-leader">
                <SelectValue placeholder="Pilih pengguna" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} · {user.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">Nama tim (otomatis)</p>
            <p className="text-sm font-semibold text-foreground">{generatedName}</p>
          </div>

          {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Simpan" : "Tambah Tim"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}