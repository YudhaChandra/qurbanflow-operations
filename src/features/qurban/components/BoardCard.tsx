import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Users, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useQurban } from "../store";
import { RESPONSIBILITY_SHORT } from "../constants";
import { ACTION_LABEL, primaryAction } from "../workflow";
import type { BoardCard as BoardCardModel } from "../types";
import { AssignTeamDialog } from "./AssignTeamDialog";
import { PackingSheet } from "./PackingSheet";

export function BoardCard({ card }: { card: BoardCardModel }) {
  const { startWork, completeWork, isReadOnly } = useQurban();
  const [assignOpen, setAssignOpen] = useState(false);
  const [packingOpen, setPackingOpen] = useState(false);
  const { animal, responsibility, team } = card;
  const action = primaryAction(responsibility);
  const isPacking = responsibility.kind === "PACKING";

  const handleAction = () => {
    if (action === "ASSIGN") return setAssignOpen(true);
    if (action === "START") {
      startWork(animal.id, responsibility.kind);
      return toast.success(`${animal.code} · ${RESPONSIBILITY_SHORT[responsibility.kind]} dimulai`);
    }
    if (action === "COMPLETE") {
      if (isPacking) return setPackingOpen(true);
      completeWork(animal.id, responsibility.kind);
      toast.success(`${animal.code} · ${RESPONSIBILITY_SHORT[responsibility.kind]} selesai`);
    }
  };

  return (
    <article className="rounded-lg border border-border bg-card p-3 shadow-subtle transition-colors hover:border-ring/40">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <h3 className="font-mono text-base font-bold leading-tight text-foreground">
            {animal.code}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {animal.shahibul.length} shahibul
          </p>
        </div>
        <StatusBadge tone="neutral" className="shrink-0">
          {RESPONSIBILITY_SHORT[responsibility.kind]}
        </StatusBadge>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{team ? team.name : "Belum ada tim"}</span>
      </div>

      {isPacking && responsibility.status !== "BELUM_DITUGASKAN" ? (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
          <span className="rounded border border-border px-1.5 py-0.5 font-mono">
            {responsibility.meatIntakes.length} meat
          </span>
          <span className="rounded border border-border px-1.5 py-0.5 font-mono">
            {responsibility.offalIntake ? "offal ✓" : "offal —"}
          </span>
          <span className="rounded border border-border px-1.5 py-0.5 font-mono">
            {responsibility.packageCount ?? "—"} pkg
          </span>
        </div>
      ) : null}

      {action && !isReadOnly ? (
        <Button
          size="sm"
          variant={action === "ASSIGN" ? "secondary" : "default"}
          className="mt-3 w-full justify-between"
          onClick={handleAction}
        >
          {isPacking && action === "COMPLETE" ? "Buka packing" : ACTION_LABEL[action]}
          {isPacking && action === "COMPLETE" ? (
            <PackageCheck className="size-4" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </Button>
      ) : null}

      {assignOpen ? (
        <AssignTeamDialog
          animal={animal}
          kind={responsibility.kind}
          open={assignOpen}
          onOpenChange={setAssignOpen}
        />
      ) : null}
      {packingOpen ? (
        <PackingSheet animal={animal} open={packingOpen} onOpenChange={setPackingOpen} />
      ) : null}
    </article>
  );
}