import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Plus, Search } from "lucide-react";
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
import { EventFormDialog } from "@/features/qurban/components/EventFormDialog";
import { EventDetailSheet } from "@/features/qurban/components/EventDetailSheet";
import {
  EVENT_STATUS_LABEL,
  EVENT_STATUS_TONE,
} from "@/features/qurban/constants";
import type { EventStatus, QurbanEvent } from "@/features/qurban/types";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Event — QurbanOps" },
      {
        name: "description",
        content: "Kelola daftar event kurban, jadwal pelaksanaan, dan status operasional.",
      },
      { property: "og:title", content: "Event — QurbanOps" },
      {
        property: "og:description",
        content: "Kelola daftar event kurban dan status operasional.",
      },
    ],
  }),
  component: EventsPage,
});

const PAGE_SIZE_OPTIONS = [10, 25, 50];

type FilterStatus = "ALL" | EventStatus;

function normalizeSearch(input: string) {
  return input.trim().toLowerCase();
}

function EventsPage() {
  const { events, setSelectedEventId } = useQurban();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<QurbanEvent | null>(null);
  const [detail, setDetail] = useState<QurbanEvent | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = useMemo(() => {
    const query = normalizeSearch(searchQuery);
    return events.filter((evt) => {
      const matchesStatus = filterStatus === "ALL" || evt.status === filterStatus;
      if (!matchesStatus) return false;
      if (!query) return true;

      const nameMatch = evt.name.toLowerCase().includes(query);
      const locationMatch = evt.location.toLowerCase().includes(query);

      return nameMatch || locationMatch;
    });
  }, [events, filterStatus, searchQuery]);

  const totalItems = filteredEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageEvents = filteredEvents.slice(startIndex, endIndex);

  const showingText =
    totalItems === 0
      ? "Menampilkan 0 Event"
      : `Menampilkan ${startIndex + 1}–${endIndex} dari ${totalItems} Event`;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: FilterStatus) => {
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
        title="Event"
        description="Kelola daftar event kurban, jadwal pelaksanaan, dan status operasional."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Buat Event
          </Button>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Belum ada event kurban"
          description="Buat event kurban baru untuk mengelola hewan, tim operasional, dan alur pelaksanaan kurban."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="size-4" />
              Buat Event
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
                  placeholder="Cari nama event atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant={filterStatus === "ALL" ? "default" : "outline"}
                  onClick={() => handleFilterChange("ALL")}
                >
                  Semua
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "DRAFT" ? "default" : "outline"}
                  onClick={() => handleFilterChange("DRAFT")}
                >
                  Draft
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "AKTIF" ? "default" : "outline"}
                  onClick={() => handleFilterChange("AKTIF")}
                >
                  Aktif
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "SELESAI" ? "default" : "outline"}
                  onClick={() => handleFilterChange("SELESAI")}
                >
                  Selesai
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
                  <TableHead>Nama Event</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageEvents.map((evt) => (
                  <TableRow key={evt.id}>
                    <TableCell className="font-semibold text-foreground">
                      <button
                        onClick={() => {
                          setSelectedEventId(evt.id);
                          setDetail(evt);
                        }}
                        className="hover:underline text-left"
                      >
                        {evt.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {evt.date}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {evt.location}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={EVENT_STATUS_TONE[evt.status]}>
                        {EVENT_STATUS_LABEL[evt.status]}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEventId(evt.id);
                            setDetail(evt);
                          }}
                        >
                          Detail
                        </Button>
                        {evt.status === "DRAFT" ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedEventId(evt.id);
                              setEditing(evt);
                            }}
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
              Tidak ada event yang cocok dengan pencarian atau filter.
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

      {addOpen ? <EventFormDialog open={addOpen} onOpenChange={setAddOpen} /> : null}

      {detail ? (
        <EventDetailSheet
          event={events.find((item) => item.id === detail.id) ?? detail}
          open
          onOpenChange={(open) => (open ? null : setDetail(null))}
        />
      ) : null}

      {editing ? (
        <EventFormDialog
          event={editing}
          open
          onOpenChange={(open) => (open ? null : setEditing(null))}
        />
      ) : null}
    </>
  );
}