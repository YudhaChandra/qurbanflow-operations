import { FileStack, Users2, Activity } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const problems = [
  {
    icon: FileStack,
    title: "Pencatatan Tersebar",
    description:
      "Data hewan, shohibul qurban, dan progres pekerjaan dapat tersebar di kertas, chat, atau spreadsheet.",
  },
  {
    icon: Users2,
    title: "Koordinasi Tim",
    description: "Panitia membutuhkan cara yang lebih jelas untuk mengetahui siapa mengerjakan apa.",
  },
  {
    icon: Activity,
    title: "Progres Sulit Dipantau",
    description:
      "Tanpa satu sumber informasi, sulit mengetahui pekerjaan mana yang belum dimulai, sedang berjalan, atau sudah selesai.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Tantangan"
          title="Operasional Kurban Tidak Harus Dikelola dari Banyak Tempat."
          description="Ketika data, koordinasi tim, dan progres pekerjaan tersebar, panitia sulit mengetahui kondisi sebenarnya di lapangan."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow duration-200 hover:shadow-panel"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
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
