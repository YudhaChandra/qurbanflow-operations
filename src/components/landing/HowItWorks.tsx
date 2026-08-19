import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    number: "01",
    title: "Daftarkan Hewan",
    description: "Masukkan data Sapi atau Kambing dan shohibul qurban.",
  },
  {
    number: "02",
    title: "Kelola Tim",
    description: "Siapkan tim operasional dan anggota yang bertanggung jawab.",
  },
  {
    number: "03",
    title: "Tugaskan Pekerjaan",
    description: "Hubungkan pekerjaan dengan tim yang tersedia.",
  },
  {
    number: "04",
    title: "Pantau Progres",
    description: "Ikuti pekerjaan dari ditugaskan hingga selesai melalui Operational Board.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-b border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Mulai dari Persiapan, Pantau hingga Selesai."
        />

        <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-11 hidden border-t border-dashed border-border lg:block"
          />
          {steps.map((step) => (
            <li
              key={step.number}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                {step.number}
              </span>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
