import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Pengguna & Hak Akses — QurbanOps" },
      {
        name: "description",
        content:
          "Manage committee members, roles and access levels for Qurban operations.",
      },
      { property: "og:title", content: "Pengguna & Hak Akses — QurbanOps" },
      {
        property: "og:description",
        content: "Manage committee members, roles and access levels.",
      },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  return (
    <>
      <PageHeader
        title="Pengguna & Hak Akses"
        description="Super Admin, Supervisor and Operational Team accounts with their permissions."
      />
      <EmptyState
        icon={ShieldCheck}
        title="Not implemented yet"
        description="Authentication and role permissions will be set up once the operational model is approved."
      />
    </>
  );
}