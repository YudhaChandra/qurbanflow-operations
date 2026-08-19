import { Layers } from "lucide-react";

const links = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Untuk Panitia", href: "#untuk-panitia" },
  { label: "Login", href: "/login" },
];

export function Footer() {
  return (
    <footer className="bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Layers className="size-4.5" />
              </span>
              <span className="text-base font-bold tracking-tight">QurbanOps</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Qurban Operations Workspace</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © 2026 QurbanOps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
