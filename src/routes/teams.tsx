import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Tim Operasional — QurbanOps" },
      {
        name: "description",
        content:
          "Organise operational teams and their station assignments for the event.",
      },
      { property: "og:title", content: "Tim Operasional — QurbanOps" },
      {
        property: "og:description",
        content: "Organise operational teams and their station assignments.",
      },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  return (
    <>
      <PageHeader
        title="Tim Operasional"
        description="Operational teams, their members and the stations they are responsible for."
      />
      <EmptyState
        icon={Users}
        title="Not implemented yet"
        description="Team structure and station model will be confirmed before implementation."
      />
    </>
  );
}