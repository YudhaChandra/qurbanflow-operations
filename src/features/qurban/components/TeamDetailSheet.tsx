import { useState } from "react";
import { toast } from "sonner";
import { Crown, Pencil, Plus, Trash2, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useQurban } from "../store";
import { RESPONSIBILITY_LABEL } from "../constants";
import { MemberFormDialog } from "./MemberFormDialog";
import { TeamFormDialog } from "./TeamFormDialog";
import type { Team, TeamMember } from "../types";

export function TeamDetailSheet({
  team,
  open,
  onOpenChange,
}: {
  team: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { users, removeMember } = useQurban();
  const [addOpen, setAddOpen] = useState(false);
  const [leaderOpen, setLeaderOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState<TeamMember | null>(null);
  const leader = users.find((user) => user.id === team.leaderUserId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-base font-bold">{team.name}</SheetTitle>
          <SheetDescription>
            {RESPONSIBILITY_LABEL[team.kind]} · {team.members.length} anggota
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4">
          <div className="rounded-md border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-2">
              <Crown className="size-4 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Ketua tim</p>
                <p className="text-sm font-semibold text-foreground">
                  {leader?.name ?? "Belum ditentukan"}
                </p>
                {leader?.phone ? (
                  <p className="font-mono text-xs text-muted-foreground">
                    {leader.phone}
                  </p>
                ) : null}
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="ml-auto"
                onClick={() => setLeaderOpen(true)}
              >
                Ganti
              </Button>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Ketua tim tidak dihitung sebagai anggota dan tidak dapat dihapus.
          </p>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Anggota ({team.members.length})
            </p>
            <p className="text-xs text-muted-foreground">
              Satu orang hanya boleh berada di satu tim operasional.
            </p>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Tambah Anggota
          </Button>
        </div>

        <div className="px-4 pb-6">
          {team.members.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
              <Users className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Belum ada anggota</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {team.members.map((member, index) => (
                <li
                  key={member.id}
                  className="rounded-md border border-border bg-card px-3 py-2"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <div className="ml-auto flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        aria-label={`Ubah ${member.name}`}
                        onClick={() => setEditing(member)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 text-destructive hover:text-destructive"
                        aria-label={`Hapus ${member.name}`}
                        onClick={() => setDeleting(member)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  {member.phone ? (
                    <p className="pl-7 font-mono text-xs text-muted-foreground">
                      {member.phone}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        {addOpen ? (
          <MemberFormDialog team={team} open={addOpen} onOpenChange={setAddOpen} />
        ) : null}

        {editing ? (
          <MemberFormDialog
            team={team}
            member={editing}
            open
            onOpenChange={(next) => (next ? null : setEditing(null))}
          />
        ) : null}

        {leaderOpen ? (
          <TeamFormDialog team={team} open={leaderOpen} onOpenChange={setLeaderOpen} />
        ) : null}

        <AlertDialog
          open={Boolean(deleting)}
          onOpenChange={(next) => (next ? null : setDeleting(null))}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus anggota?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleting?.name} akan dikeluarkan dari {team.name}. Riwayat penugasan di
                Papan Operasional tidak terpengaruh karena penugasan dilakukan ke tim.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (!deleting) return;
                  removeMember(team.id, deleting.id);
                  toast.success(`Anggota dihapus — ${team.name}`);
                  setDeleting(null);
                }}
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}