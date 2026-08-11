import { createFileRoute } from "@tanstack/react-router";
import { Beef } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/animals")({
  head: () => ({
    meta: [
      { title: "Animal Management — QurbanOps" },
      {
        name: "description",
        content:
          "Register and track every Qurban animal, its owners and its processing state.",
      },
      { property: "og:title", content: "Animal Management — QurbanOps" },
      {
        property: "og:description",
        content: "Register and track every Qurban animal and its processing state.",
      },
    ],
  }),
  component: AnimalsPage,
});

function AnimalsPage() {
  return (
    <>
      <PageHeader
        title="Animal Management"
        description="Registered animals, their identifiers and their current position in the operational flow."
      />
      <EmptyState
        icon={Beef}
        title="Not implemented yet"
        description="Animal fields, identifiers and registration rules will be defined with you before this screen is built."
      />
    </>
  );
}