import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useQurban } from "../store";
import {
  RESPONSIBILITY_LABEL,
  RESPONSIBILITY_ORDER,
  RESPONSIBILITY_SHORT,
  WORKFLOW_ORDER,
} from "../constants";
import type { BoardCard as BoardCardModel, ResponsibilityKind } from "../types";
import { BoardColumn } from "./BoardColumn";

export function OperationalBoard() {
  const { event, animals, teams, outstandingResponsibilities, completeEvent } =
    useQurban();
  const [activeKind, setActiveKind] = useState<ResponsibilityKind>("SLAUGHTER");

  const cards = useMemo<BoardCardModel[]>(() => {
    return animals.map((animal) => {
      const responsibility = animal.responsibilities[activeKind];
      return {
        animal,
        responsibility,
        team: teams.find((team) => team.id === responsibility.teamId) ?? null,
      };
    });
  }, [animals, teams, activeKind]);

  const total = cards.length;
  const done = cards.filter((card) => card.responsibility.status === "SELESAI").length;

  return (
    <>
      <PageHeader
        title="Papan Operasional"
        description={`${event.name} · ${event.location}`}
        actions={
          event.completed ? (
            <StatusBadge tone="success">Acara selesai</StatusBadge>
          ) : (
            <Button
              disabled={outstandingResponsibilities > 0}
              onClick={() => {
                completeEvent();
                toast.success("Acara selesai");
              }}
              title={
                outstandingResponsibilities > 0
                  ? `${outstandingResponsibilities} tanggung jawab masih terbuka`
                  : undefined
              }
            >
              <CheckCircle2 className="size-4" />
              Selesaikan acara
            </Button>
          )
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-4 sm:flex sm:justify-between">
        <Tabs
          value={activeKind}
          onValueChange={(value) => setActiveKind(value as ResponsibilityKind)}
        >
          <TabsList>
            {RESPONSIBILITY_ORDER.map((kind) => (
              <TabsTrigger key={kind} value={kind} title={RESPONSIBILITY_LABEL[kind]}>
                {RESPONSIBILITY_SHORT[kind]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="shrink-0 font-mono text-xs text-muted-foreground">
          {done}/{total} selesai
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0">
        <div className="flex gap-3 lg:grid lg:grid-cols-4 lg:items-start">
          {WORKFLOW_ORDER.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              cards={cards.filter((card) => card.responsibility.status === status)}
            />
          ))}
        </div>
      </div>
    </>
  );
}