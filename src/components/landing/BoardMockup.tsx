import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusStyles, type BoardColumn } from "./board-data";

interface BoardMockupProps {
  columns: BoardColumn[];
  title?: string;
  className?: string;
  compact?: boolean;
}

export function BoardMockup({
  columns,
  title = "Operational Board",
  className,
  compact = false,
}: BoardMockupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-panel",
        className,
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <p className="truncate text-sm font-semibold">{title}</p>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          Event Kurban 1447 H
        </span>
      </div>

      <div className="overflow-x-auto">
        <div
          className={cn(
            "grid grid-cols-4 gap-3 bg-surface-strong/60 p-3 sm:gap-4 sm:p-4",
            compact ? "min-w-[500px]" : "min-w-[720px]",
          )}
        >
          {columns.map((column) => (
            <div key={column.title} className="min-w-0 rounded-xl border border-border bg-card/70 p-2.5">
              <div className="mb-3 flex items-center justify-between gap-2 px-1">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn("h-2 w-2 shrink-0 rounded-full", statusStyles[column.status].dot)}
                  />
                  <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {column.title}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
                  {column.cards.length}
                </span>
              </div>

              <div className="space-y-2">
                {column.cards.map((card) => (
                  <div
                    key={card.animal}
                    className="rounded-lg border border-border bg-card p-3 shadow-card transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <p className="truncate text-xs font-bold tracking-tight">{card.animal}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{card.shahibul}</p>
                    {!compact && (
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Users className="size-3 shrink-0" />
                        <span className="truncate">{card.team}</span>
                      </div>
                    )}
                    {compact && (
                      <p className="mt-2 truncate text-[11px] text-muted-foreground">{card.team}</p>
                    )}
                    <span
                      className={cn(
                        "mt-2.5 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        statusStyles[column.status].chip,
                      )}
                    >
                      {card.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
