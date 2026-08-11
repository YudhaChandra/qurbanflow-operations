import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operational Board — QurbanOps" },
      {
        name: "description",
        content:
          "Live operational board tracking every animal through the Qurban processing pipeline.",
      },
      { property: "og:title", content: "Operational Board — QurbanOps" },
      {
        property: "og:description",
        content:
          "Track every animal through the Qurban processing pipeline in real time.",
      },
    ],
  }),
  component: BoardPage,
});

function BoardPage() {
  return (
    <>
      <PageHeader
        title="Operational Board"
        description="The single screen your teams work from during the event. Every animal moves across the pipeline here."
        actions={<StatusBadge tone="info">Awaiting workflow approval</StatusBadge>}
      />
      <EmptyState
        icon={LayoutDashboard}
        title="Board workflow not defined yet"
        description="The pipeline stages, statuses and station handoffs need to be confirmed before this board is implemented, so nothing here is invented."
      />
    </>
  );
}
