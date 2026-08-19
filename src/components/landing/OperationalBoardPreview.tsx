import { ChevronRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { BoardMockup } from "./BoardMockup";
import { fullBoard, workflowSteps } from "./board-data";

export function OperationalBoardPreview() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Operational Board"
          title="Semua Progres Operasional, Terlihat Jelas."
          description="Operational Board menjadi pusat aktivitas QurbanOps untuk memantau setiap pekerjaan dari awal hingga selesai."
        />

        <div className="mt-12">
          <BoardMockup columns={fullBoard} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {workflowSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium sm:text-sm">
                {step}
              </span>
              {index < workflowSteps.length - 1 && (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Setiap kartu mewakili pekerjaan pada hewan tertentu sehingga panitia dapat melihat kondisi
          operasional secara cepat.
        </p>
      </div>
    </section>
  );
}
