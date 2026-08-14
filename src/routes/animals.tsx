import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Beef, Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
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
import type { Animal } from "@/features/qurban/types";

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

function AnimalsPage() {
  const { event, animals } = useQurban();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Animal | null>(null);
  const [detail, setDetail] = useState<Animal | null>(null);

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
              {animals.map((animal) => {
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