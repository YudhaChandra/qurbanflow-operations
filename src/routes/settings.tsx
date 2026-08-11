import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — QurbanOps" },
      {
        name: "description",
        content: "Workspace and operational preferences for your Qurban committee.",
      },
      { property: "og:title", content: "Settings — QurbanOps" },
      {
        property: "og:description",
        content: "Workspace and operational preferences for your committee.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Preferences that apply across the workspace."
      />
      <EmptyState
        icon={Settings}
        title="Not implemented yet"
        description="Settings will be added as features land, so options always map to real behaviour."
      />
    </>
  );
}