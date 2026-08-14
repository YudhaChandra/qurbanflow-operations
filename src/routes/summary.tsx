import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Ringkasan Event — QurbanOps" },
      {
        name: "description",
        content: "Completion overview of a Qurban event once operations are finished.",
      },
      { property: "og:title", content: "Ringkasan Event — QurbanOps" },
      {
        property: "og:description",
        content: "Completion overview of a Qurban event after operations finish.",
      },
    ],
  }),
  component: SummaryPage,
});

function SummaryPage() {
  return (
    <>
      <PageHeader
        title="Ringkasan Event"
        description="What was completed, what remains and how the event closed out."
      />
      <EmptyState
        icon={ClipboardList}
        title="Not implemented yet"
        description="The summary depends on the board workflow, so it will be built after that is approved."
      />
    </>
  );
}