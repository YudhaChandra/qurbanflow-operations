import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardMockup } from "./BoardMockup";
import { heroBoard } from "./board-data";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="min-w-0 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Qurban Operations Workspace
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              Kelola Operasional Kurban.
              <span className="block text-primary">Lebih Terstruktur. Lebih Terpantau.</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              QurbanOps membantu panitia mengelola hewan kurban, tim operasional, dan progres
              pekerjaan dalam satu workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href="/login">
                  Mulai Gunakan QurbanOps
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <a href="#cara-kerja">Lihat Cara Kerja</a>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Manajemen hewan & tim", "Operational Board", "Progres real-time di lapangan"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="relative min-w-0">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-3xl bg-primary-soft/70 blur-2xl"
            />
            <BoardMockup columns={heroBoard} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
