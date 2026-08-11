import { Link } from "@tanstack/react-router";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar px-3 py-4">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-2 py-1"
      >
        <span className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-[11px] font-semibold tracking-tight text-sidebar-primary-foreground">
          QO
        </span>
        <span className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
          QurbanOps
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {navigation.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                activeOptions={{ exact: item.to === "/" }}
                className={cn(
                  "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                activeProps={{
                  className:
                    "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                }}
              >
                <item.icon className="size-4 shrink-0 opacity-70" aria-hidden />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border pt-3">
        <div className="flex items-center gap-2.5 px-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-sidebar-accent text-[11px] font-medium text-sidebar-accent-foreground">
            SA
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-sidebar-accent-foreground">
              Super Admin
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Committee workspace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}