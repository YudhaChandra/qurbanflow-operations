import { ShieldCheck, Slice, Soup, Package, Settings2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const roles = [
  {
    icon: ShieldCheck,
    title: "Ketua / Supervisor",
    description: "Memantau kondisi operasional event secara menyeluruh.",
  },
  {
    icon: Slice,
    title: "Tim Jagal",
    description: "Menangani proses penyembelihan hewan yang ditugaskan.",
  },
  {
    icon: Soup,
    title: "Tim Jeroan",
    description: "Mengerjakan pembersihan dan pengolahan jeroan.",
  },
  {
    icon: Package,
    title: "Tim Packing",
    description: "Mencatat proses packing dan hasil paket daging.",
  },
  {
    icon: Settings2,
    title: "Admin / Pengelola",
    description: "Mengelola data hewan, tim, dan pengaturan event.",
  },
];

export function TargetUsers() {
  return (
    <section id="untuk-panitia" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Untuk Panitia"
          title="Dibuat untuk Panitia Kurban."
          description="QurbanOps membantu setiap bagian tim memahami pekerjaan dan tanggung jawabnya."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
