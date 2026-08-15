import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Beef, Plus, Search } from "lucide-react";
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
import { AnimalFormDialog } from "@/features/qurban/components/AnimalFormDialog";
import { AnimalDetailSheet } from "@/features/qurban/components/AnimalDetailSheet";
import {
  ANIMAL_TYPE_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
} from "@/features/qurban/constants";
import { animalStatus } from "@/features/qurban/workflow";
import type { Animal, AnimalType } from "@/features/qurban/types";

export const Route = createFileRoute("/animals")({
  head: () => ({
    meta: [
      { title: "Hewan — QurbanOps" },
      {
        name: "description",
        content:
          "Register and track every Qurban animal, its owners and its processing state.",
      },
      { property: "og:title", content: "Hewan — QurbanOps" },
      { property: "og:description", content: "Register and track every Qurban animal and its processing state." },
    ],
  }),
  component: AnimalsPage,
});

const PAGE_SIZE_OPTIONS = [10, 25, 50];

type FilterType = "ALL" | AnimalType;

function normalizeSearch(input: string) {
  return input.trim().toLowerCase();
}

function AnimalsPage() {
  const { event, animals } = useQurban();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Animal | null>(null);
  const [detail, setDetail] = useState<Animal | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAnimals = useMemo(() => {
    const query = normalizeSearch(searchQuery);
    return animals.filter((animal) => {
      const matchesType = filterType === "ALL" || animal.type === filterType;
      if (!matchesType) return false;
      if (!query) return true;
      if (animal.code.toLowerCase().includes(query)) return true;
      return animal.shahibul.some((item) => item.name.toLowerCase().includes(query));
    });
  }, [animals, filterType, searchQuery]);

  const totalItems = filteredAnimals.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageAnimals = filteredAnimals.slice(startIndex, endIndex);

  const showingText =
    totalItems === 0
      ? "Menampilkan 0 hewan"
      : `Menampilkan ${startIndex + 1}–${endIndex} dari ${totalItems} hewan`;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: FilterType) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="Hewan"
        description={`Daftar hewan pada ${event.name}. Identitas hewan dibuat otomatis per jenis dan diulang setiap acara.`}
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Tambah Hewan
          </Button>
        }
      />

      {animals.length === 0 ? (
        <EmptyState
          icon={Beef}
          title="Belum ada hewan"
          description="Tambahkan hewan untuk mulai menjalankan alur operasional pada acara ini."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="size-4" />
              Tambah Hewan
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
                  placeholder="Cari identitas atau shahibul..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={filterType === "ALL" ? "default" : "outline"}
                  onClick={() => handleFilterChange("ALL")}
                >
                  Semua
                </Button>
                <Button
                  size="sm"
                  variant={filterType === "SAPI" ? "default" : "outline"}
                  onClick={() => handleFilterChange("SAPI")}
                >
                  Sapi
                </Button>
                <Button
                  size="sm"
                  variant={filterType === "KAMBING" ? "default" : "outline"}
                  onClick={() => handleFilterChange("KAMBING")}
                >
                  Kambing
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
                  <TableHead>Identitas</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead className="text-right">Shahibul</TableHead>
                  <TableHead>Status Operasional</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageAnimals.map((animal) => {
                  const status = animalStatus(animal);
                  return (
                    <TableRow key={animal.id}>
                      <TableCell className="font-mono text-sm font-bold text-foreground">
                        {animal.code}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ANIMAL_TYPE_LABEL[animal.type]}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {animal.shahibul.length}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={STATUS_TONE[status]}>
                          {STATUS_LABEL[status]}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDetail(animal)}
                          >
                            Detail
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditing(animal)}
                          >
                            Ubah
                          </Button>
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
              Tidak ada hewan yang cocok dengan pencarian atau filter.
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

      {addOpen ? <AnimalFormDialog open={addOpen} onOpenChange={setAddOpen} /> : null}
      {detail ? (
        <AnimalDetailSheet
          animal={animals.find((item) => item.id === detail.id) ?? detail}
          open
          onOpenChange={(open) => (open ? null : setDetail(null))}
        />
      ) : null}
      {editing ? (
        <AnimalFormDialog
          animal={editing}
          open
          onOpenChange={(open) => (open ? null : setEditing(null))}
        />
      ) : null}
    </>
  );
}
