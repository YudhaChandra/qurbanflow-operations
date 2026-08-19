import { Beef, UsersRound, KanbanSquare, Package, ClipboardList } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const features = [
  {
    icon: Beef,
    title: "Manajemen Hewan",
    description: "Kelola data Sapi dan Kambing beserta informasi shohibul qurban.",
  },
  {
    icon: UsersRound,
    title: "Manajemen Tim",
    description: "Kelola tim operasional, anggota, dan pembagian tanggung jawab.",
  },
  {
    icon: KanbanSquare,
    title: "Operational Board",
    description: "Pantau pekerjaan setiap hewan melalui workflow yang jelas.",
  },
  {
    icon: Package,
    title: "Packing",
    description: "Catat proses packing dan jumlah paket yang dihasilkan.",
  },
  {
    icon: ClipboardList,
    title: "Ringkasan Event",
    description: "Lihat ringkasan operasional event secara cepat.",
  },
];

export function FeatureSection() {
  return (
    <section id="fitur" className="border-b border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Fitur"
          title="Satu Workspace untuk Seluruh Operasional."
          description="QurbanOps menyatukan informasi penting dan aktivitas operasional dalam satu tempat."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-primary transition-colors group-hover:bg-primary-soft">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
