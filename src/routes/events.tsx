import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Event Management — QurbanOps" },
      {
        name: "description",
        content: "Create and manage Qurban events, schedules and active operations.",
      },
      { property: "og:title", content: "Event Management — QurbanOps" },
      {
        property: "og:description",
        content: "Create and manage Qurban events and active operations.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <>
      <PageHeader
        title="Event Management"
        description="Qurban events with their dates, locations and operational status."
      />
      <EmptyState
        icon={CalendarDays}
        title="Not implemented yet"
        description="Event lifecycle and states will be agreed before this screen is built."
      />
    </>
  );
}