import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useQurban } from "@/features/qurban/store";
import { TeamFormDialog } from "@/features/qurban/components/TeamFormDialog";
import { TeamDetailSheet } from "@/features/qurban/components/TeamDetailSheet";
import { RESPONSIBILITY_LABEL } from "@/features/qurban/constants";
import type { ResponsibilityKind, Team } from "@/features/qurban/types";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Tim Operasional — QurbanOps" },
      {
        name: "description",
        content:
          "Organise operational teams and their station assignments for the event.",
      },
      { property: "og:title", content: "Tim Operasional — QurbanOps" },
      {
        property: "og:description",
        content: "Organise operational teams and their station assignments.",
      },
    ],
  }),
  component: TeamsPage,
});

const PAGE_SIZE_OPTIONS = [10, 25, 50];

type FilterKind = "ALL" | ResponsibilityKind;

function normalizeSearch(input: string) {
  return input.trim().toLowerCase();
}

function TeamsPage() {
  const { event, teams, users, deleteTeam, isReadOnly } = useQurban();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [detail, setDetail] = useState<Team | null>(null);
  const [deleting, setDeleting] = useState<Team | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterKind, setFilterKind] = useState<FilterKind>("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTeams = useMemo(() => {
    const query = normalizeSearch(searchQuery);
    return teams.filter((team) => {
      const matchesKind = filterKind === "ALL" || team.kind === filterKind;
      if (!matchesKind) return false;
      if (!query) return true;
      if (team.name.toLowerCase().includes(query)) return true;

      const leader = users.find((user) => user.id === team.leaderUserId);
      if (leader?.name.toLowerCase().includes(query)) return true;

      return team.members.some((member) =>
        member.name.toLowerCase().includes(query),
      );
    });
  }, [teams, users, filterKind, searchQuery]);

  const totalItems = filteredTeams.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageTeams = filteredTeams.slice(startIndex, endIndex);

  const showingText =
    totalItems === 0
      ? "Menampilkan 0 tim"
      : `Menampilkan ${startIndex + 1}–${endIndex} dari ${totalItems} tim`;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: FilterKind) => {
    setFilterKind(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="Tim Operasional"
        description={`Kelola tim operasional dan penugasan untuk event "${event.name}".`}
        actions={
          !isReadOnly ? (
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="size-4" />
              Tambah Tim
            </Button>
          ) : null
        }
      />

      {teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum ada tim operasional"
          description="Tambahkan tim operasional untuk menugaskan pekerjaan jagal, jeroan, dan packing pada acara kurban ini."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="size-4" />
              Tambah Tim
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari tim, ketua, atau anggota..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={filterKind === "ALL" ? "default" : "outline"}
                  onClick={() => handleFilterChange("ALL")}
                >
                  Semua
                </Button>
                <Button
                  size="sm"
                  variant={filterKind === "SLAUGHTER" ? "default" : "outline"}
                  onClick={() => handleFilterChange("SLAUGHTER")}
                >
                  Jagal
                </Button>
                <Button
                  size="sm"
                  variant={filterKind === "OFFAL" ? "default" : "outline"}
                  onClick={() => handleFilterChange("OFFAL")}
                >
                  Jeroan
                </Button>
                <Button
                  size="sm"
                  variant={filterKind === "PACKING" ? "default" : "outline"}
                  onClick={() => handleFilterChange("PACKING")}
                >
                  Packing
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Baris per halaman</span>
              <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Tim</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Ketua Tim</TableHead>
                  <TableHead className="text-right">Jumlah Anggota</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageTeams.map((team) => {
                  const leader = users.find((user) => user.id === team.leaderUserId);
                  return (
                    <TableRow key={team.id}>
                      <TableCell className="font-semibold text-foreground">
                        {team.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {RESPONSIBILITY_LABEL[team.kind]}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="font-medium text-foreground">
                            {leader?.name ?? "Belum ditentukan"}
                          </span>
                          {leader?.phone ? (
                            <span className="block font-mono text-xs text-muted-foreground">
                              {leader.phone}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {team.members.length} anggota
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDetail(team)}
                          >
                            Detail
                          </Button>
                          {!isReadOnly ? (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditing(team)}
                              >
                                Ubah
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleting(team)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {totalItems === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada tim yang cocok dengan pencarian atau filter.
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <span className="text-sm text-muted-foreground">{showingText}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  Sebelumnya
                </Button>
                <span className="min-w-[4rem] text-center text-sm text-muted-foreground">
                  Halaman {safePage} dari {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {addOpen ? <TeamFormDialog open={addOpen} onOpenChange={setAddOpen} /> : null}

      {detail ? (
        <TeamDetailSheet
          team={teams.find((item) => item.id === detail.id) ?? detail}
          open
          onOpenChange={(open) => (open ? null : setDetail(null))}
        />
      ) : null}

      {editing ? (
        <TeamFormDialog
          team={editing}
          open
          onOpenChange={(open) => (open ? null : setEditing(null))}
        />
      ) : null}

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(next) => (next ? null : setDeleting(null))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tim?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name} ({RESPONSIBILITY_LABEL[deleting?.kind ?? "SLAUGHTER"]}) akan
              dihapus. Penugasan tim ini pada Papan Operasional akan dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleting) return;
                deleteTeam(deleting.id);
                toast.success(`Tim dihapus — ${deleting.name}`);
                setDeleting(null);
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}