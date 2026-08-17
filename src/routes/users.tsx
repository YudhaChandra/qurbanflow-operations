import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
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
import { useQurban } from "@/features/qurban/store";
import { UserFormDialog } from "@/features/qurban/components/UserFormDialog";
import { UserDetailSheet } from "@/features/qurban/components/UserDetailSheet";
import {
  USER_ROLE_LABEL,
  USER_STATUS_LABEL,
  USER_STATUS_TONE,
} from "@/features/qurban/constants";
import type { SystemUser, UserRole, UserStatus } from "@/features/qurban/types";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Pengguna & Hak Akses — QurbanOps" },
      {
        name: "description",
        content: "Kelola akun pengguna, peran, dan hak akses operasional kurban.",
      },
      { property: "og:title", content: "Pengguna & Hak Akses — QurbanOps" },
      {
        property: "og:description",
        content: "Kelola akun pengguna, peran, dan hak akses operasional kurban.",
      },
    ],
  }),
  component: UsersPage,
});

const PAGE_SIZE_OPTIONS = [10, 25, 50];

type FilterRole = "ALL" | Extract<UserRole, "SUPERVISOR" | "KETUA_TIM">;
type FilterStatus = "ALL" | UserStatus;

function normalizeSearch(input: string) {
  return input.trim().toLowerCase();
}

function UsersPage() {
  const { users } = useQurban();

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<SystemUser | null>(null);
  const [detail, setDetail] = useState<SystemUser | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<FilterRole>("ALL");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const query = normalizeSearch(searchQuery);
    return users.filter((u) => {
      const matchesRole = filterRole === "ALL" || u.role === filterRole;
      if (!matchesRole) return false;

      const matchesStatus = filterStatus === "ALL" || u.status === filterStatus;
      if (!matchesStatus) return false;

      if (!query) return true;

      const nameMatch = u.name.toLowerCase().includes(query);
      const emailMatch = u.email.toLowerCase().includes(query);

      return nameMatch || emailMatch;
    });
  }, [users, filterRole, filterStatus, searchQuery]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageUsers = filteredUsers.slice(startIndex, endIndex);

  const showingText =
    totalItems === 0
      ? "Menampilkan 0 Pengguna"
      : `Menampilkan ${startIndex + 1}–${endIndex} dari ${totalItems} Pengguna`;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: FilterRole) => {
    setFilterRole(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: FilterStatus) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="Pengguna & Hak Akses"
        description="Kelola akun pengguna, peran (role), dan hak akses untuk operasional kurban."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Tambah Pengguna
          </Button>
        }
      />

      {users.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Belum ada pengguna"
          description="Tambahkan pengguna baru untuk mengelola peran dan hak akses operasional."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="size-4" />
              Tambah Pengguna
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Role filter */}
              <div className="flex flex-wrap items-center gap-1.5 border-r border-border pr-3">
                <span className="text-xs text-muted-foreground mr-1">Peran:</span>
                <Button
                  size="sm"
                  variant={filterRole === "ALL" ? "default" : "outline"}
                  onClick={() => handleRoleFilterChange("ALL")}
                >
                  Semua
                </Button>
                <Button
                  size="sm"
                  variant={filterRole === "SUPERVISOR" ? "default" : "outline"}
                  onClick={() => handleRoleFilterChange("SUPERVISOR")}
                >
                  Supervisor
                </Button>
                <Button
                  size="sm"
                  variant={filterRole === "KETUA_TIM" ? "default" : "outline"}
                  onClick={() => handleRoleFilterChange("KETUA_TIM")}
                >
                  Ketua Tim
                </Button>
              </div>

              {/* Status filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground mr-1">Status:</span>
                <Button
                  size="sm"
                  variant={filterStatus === "ALL" ? "default" : "outline"}
                  onClick={() => handleStatusFilterChange("ALL")}
                >
                  Semua
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "PENDING" ? "default" : "outline"}
                  onClick={() => handleStatusFilterChange("PENDING")}
                >
                  Pending
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "AKTIF" ? "default" : "outline"}
                  onClick={() => handleStatusFilterChange("AKTIF")}
                >
                  Aktif
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "NONAKTIF" ? "default" : "outline"}
                  onClick={() => handleStatusFilterChange("NONAKTIF")}
                >
                  Nonaktif
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
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Email Gmail</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-semibold text-foreground">
                      <button
                        onClick={() => setDetail(u)}
                        className="hover:underline text-left"
                      >
                        {u.name}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-foreground">
                        {USER_ROLE_LABEL[u.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={USER_STATUS_TONE[u.status]}>
                        {USER_STATUS_LABEL[u.status]}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDetail(u)}
                        >
                          Detail
                        </Button>
                        {u.role !== "SUPER_ADMIN" ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditing(u)}
                          >
                            Ubah
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalItems === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada pengguna yang cocok dengan pencarian atau filter.
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

      {addOpen ? <UserFormDialog open={addOpen} onOpenChange={setAddOpen} /> : null}

      {detail ? (
        <UserDetailSheet
          user={users.find((item) => item.id === detail.id) ?? detail}
          open
          onOpenChange={(open) => (open ? null : setDetail(null))}
        />
      ) : null}

      {editing ? (
        <UserFormDialog
          user={editing}
          open
          onOpenChange={(open) => (open ? null : setEditing(null))}
        />
      ) : null}
    </>
  );
}