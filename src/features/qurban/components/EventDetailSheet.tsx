import { useState } from "react";
import { toast } from "sonner";
import { Beef, CalendarDays, CheckCircle2, MapPin, Pencil, Play, Users } from "lucide-react";
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
import { StatusBadge } from "@/components/common/StatusBadge";
import { useQurban } from "../store";
import { EVENT_STATUS_LABEL, EVENT_STATUS_TONE } from "../constants";
import { EventFormDialog } from "./EventFormDialog";
import type { QurbanEvent } from "../types";

export function EventDetailSheet({
  event,
  open,
  onOpenChange,
}: {
  event: QurbanEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { activateEvent, finishEvent, getEventStats } = useQurban();
  const [editOpen, setEditOpen] = useState(false);
  const [finishConfirmOpen, setFinishConfirmOpen] = useState(false);

  const stats = getEventStats(event.id);

  const handleActivate = () => {
    const res = activateEvent(event.id);
    if (res.success) {
      toast.success(`Event "${event.name}" berhasil diaktifkan!`);
    } else {
      toast.error(res.message);
    }
  };

  const handleFinish = () => {
    finishEvent(event.id);
    toast.success(`Event "${event.name}" telah diselesaikan.`);
    setFinishConfirmOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            <StatusBadge tone={EVENT_STATUS_TONE[event.status]}>
              {EVENT_STATUS_LABEL[event.status]}
            </StatusBadge>
          </div>
          <SheetTitle className="text-lg font-bold">{event.name}</SheetTitle>
          <SheetDescription>
            Rincian operasional dan status alur hidup event kurban.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-3 rounded-lg border border-border bg-card p-3">
            <div className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 size-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Tanggal Event</p>
                <p className="text-sm font-medium text-foreground">{event.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Lokasi Pelaksanaan</p>
                <p className="text-sm font-medium text-foreground">{event.location}</p>
              </div>
            </div>

            {event.description ? (
              <div className="pt-1">
                <p className="text-xs text-muted-foreground">Deskripsi</p>
                <p className="text-sm text-foreground">{event.description}</p>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
                <Beef className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Hewan</p>
                <p className="text-base font-bold text-foreground">{stats.animalCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tim Operasional</p>
                <p className="text-base font-bold text-foreground">{stats.teamCount}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Aksi Operasional
          </p>

          {event.status === "DRAFT" ? (
            <div className="flex flex-col gap-2">
              <Button onClick={handleActivate} className="w-full">
                <Play className="size-4" />
                Aktifkan Event
              </Button>
              <Button variant="outline" onClick={() => setEditOpen(true)} className="w-full">
                <Pencil className="size-4" />
                Ubah Event
              </Button>
            </div>
          ) : null}

          {event.status === "AKTIF" ? (
            <div className="space-y-2">
              <Button
                variant="default"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setFinishConfirmOpen(true)}
              >
                <CheckCircle2 className="size-4" />
                Selesaikan Event
              </Button>
              <p className="text-xs text-muted-foreground">
                Menyelesaikan event akan mengunci data hewan, tim, dan papan operasional menjadi Read Only.
              </p>
            </div>
          ) : null}

          {event.status === "SELESAI" ? (
            <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              Event ini telah <span className="font-semibold text-foreground">Selesai</span>. Seluruh data hewan, tim, dan papan operasional telah terkunci sebagai arsip historis.
            </div>
          ) : null}
        </div>

        {editOpen ? (
          <EventFormDialog
            event={event}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        ) : null}

        <AlertDialog open={finishConfirmOpen} onOpenChange={setFinishConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Selesaikan Event Ini?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menyelesaikan "{event.name}"?
                Setelah diselesaikan, event ini beserta hewan kurban dan tim operasional akan menjadi bersifat Read Only (hanya baca).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleFinish}>
                Selesaikan Event
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}
