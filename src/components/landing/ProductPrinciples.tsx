const principles = [
  { title: "Operational First", description: "Fokus pada pekerjaan yang harus dilakukan." },
  {
    title: "Simple & Clear",
    description: "Informasi penting terlihat tanpa langkah yang tidak perlu.",
  },
  { title: "One Workspace", description: "Data dan progres operasional berada dalam satu tempat." },
  {
    title: "Built for the Field",
    description: "Dirancang untuk digunakan saat operasional kurban berlangsung.",
  },
];

export function ProductPrinciples() {
  return (
    <section className="border-b border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle) => (
            <div key={principle.title} className="border-l-2 border-primary/30 pl-4">
              <h3 className="text-sm font-semibold">{principle.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
