import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-3xl border border-border bg-primary px-6 py-12 text-center shadow-panel sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-3xl">
            Siap Membuat Operasional Kurban Lebih Terstruktur?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Mulai kelola event, hewan, tim, dan progres pekerjaan dalam satu workspace.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="/login">
                Mulai Gunakan QurbanOps
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-primary-foreground/75">
            Sudah memiliki akses?{" "}
            <a href="/login" className="font-medium text-primary-foreground underline underline-offset-4">
              Masuk ke QurbanOps.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
