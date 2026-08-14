import { createFileRoute } from "@tanstack/react-router";
import { OperationalBoard } from "@/features/qurban/components/OperationalBoard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Papan Operasional — QurbanOps" },
      {
        name: "description",
        content:
          "Live operational board tracking every animal through the Qurban processing pipeline.",
      },
      { property: "og:title", content: "Papan Operasional — QurbanOps" },
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
