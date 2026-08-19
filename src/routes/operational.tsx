import { createFileRoute } from "@tanstack/react-router";
import { OperationalBoard } from "@/features/qurban/components/OperationalBoard";

export const Route = createFileRoute("/operational")({
  component: OperationalBoard,
});
