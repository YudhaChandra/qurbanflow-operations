import { StatusBadge } from "@/components/common/StatusBadge";
import { STATUS_LABEL, STATUS_TONE } from "../constants";
import type { BoardCard as BoardCardModel, WorkflowStatus } from "../types";
import { BoardCard } from "./BoardCard";

export function BoardColumn({
  status,
  cards,
}: {
  status: WorkflowStatus;
  cards: BoardCardModel[];
}) {
  return (
    <section className="flex w-[280px] shrink-0 flex-col rounded-lg border border-border bg-surface lg:w-auto">
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <StatusBadge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</StatusBadge>
        <span className="font-mono text-xs text-muted-foreground">{cards.length}</span>
      </header>
      <div className="flex flex-col gap-2 p-2">
        {cards.length === 0 ? (
          <p className="px-1 py-6 text-center text-xs text-muted-foreground">
            Nothing here
          </p>
        ) : (
          cards.map((card) => (
            <BoardCard key={`${card.animal.id}-${card.responsibility.kind}`} card={card} />
          ))
        )}
      </div>
    </section>
  );
}