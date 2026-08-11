import { createFileRoute } from "@tanstack/react-router";
import { OperationalBoard } from "@/features/qurban/components/OperationalBoard";

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
  return <OperationalBoard />;
}
