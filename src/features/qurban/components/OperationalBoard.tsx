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

type Filter = ResponsibilityKind | "ALL";

export function OperationalBoard() {
  const { event, animals, teams, outstandingResponsibilities, completeEvent } =
    useQurban();
  const [filter, setFilter] = useState<Filter>("ALL");

  const cards = useMemo<BoardCardModel[]>(() => {
    const kinds = filter === "ALL" ? RESPONSIBILITY_ORDER : [filter];
    return animals.flatMap((animal) =>
      kinds.map((kind) => {
        const responsibility = animal.responsibilities[kind];
        return {
          animal,
          responsibility,
          team: teams.find((team) => team.id === responsibility.teamId) ?? null,
        };
      }),
    );
  }, [animals, teams, filter]);

  const total = cards.length;
  const done = cards.filter((card) => card.responsibility.status === "SELESAI").length;

  return (
    <>
      <PageHeader
        title="Operational Board"
        description={`${event.name} · ${event.location}`}
        actions={
          event.completed ? (
            <StatusBadge tone="success">Event completed</StatusBadge>
          ) : (
            <Button
              disabled={outstandingResponsibilities > 0}
              onClick={() => {
                completeEvent();
                toast.success("Event completed");
              }}
              title={
                outstandingResponsibilities > 0
                  ? `${outstandingResponsibilities} responsibilities still open`
                  : undefined
              }
            >
              <CheckCircle2 className="size-4" />
              Complete event
            </Button>
          )
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-4 sm:flex sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
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