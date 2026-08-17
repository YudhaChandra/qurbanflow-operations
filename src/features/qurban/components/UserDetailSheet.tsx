import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  Lock,
  Mail,
  Pencil,
  Shield,
  ShieldCheck,
  UserX,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { useQurban } from "../store";
import {
  USER_ROLE_LABEL,
  USER_STATUS_LABEL,
  USER_STATUS_TONE,
} from "../constants";
import { UserFormDialog } from "./UserFormDialog";
import type { SystemUser } from "../types";

export function UserDetailSheet({
  user,
  open,
  onOpenChange,
}: {
  user: SystemUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setUserStatus } = useQurban();
  const [editOpen, setEditOpen] = useState(false);

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const handleToggleStatus = () => {
    const nextStatus = user.status === "AKTIF" ? "NONAKTIF" : "AKTIF";
    const res = setUserStatus(user.id, nextStatus);

    if (res.success) {
      toast.success(
        `Status pengguna "${user.name}" berhasil diubah menjadi ${USER_STATUS_LABEL[nextStatus]}.`,
      );
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={USER_STATUS_TONE[user.status]}>
              {USER_STATUS_LABEL[user.status]}
            </StatusBadge>
            <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
              {USER_ROLE_LABEL[user.role]}
            </span>
          </div>
          <SheetTitle className="text-lg font-bold">{user.name}</SheetTitle>
          <SheetDescription>
            Rincian profil, hak akses peran, dan status akun pengguna.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-3 rounded-lg border border-border bg-card p-3">
            <div className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email Google Sign-In</p>
                <p className="font-mono text-sm font-medium text-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Shield className="mt-0.5 size-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Peran Hak Akses</p>
                <p className="text-sm font-medium text-foreground">
                  {USER_ROLE_LABEL[user.role]}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 size-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Tanggal Terdaftar</p>
                <p className="text-sm font-medium text-foreground">{user.createdAt}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Aksi Manajemen Akun
          </p>

          {isSuperAdmin ? (
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <Lock className="mt-0.5 size-4 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Super Admin Sistem</p>
                <p>
                  Akun Super Admin adalah pengelola utama workspace. Akun ini tidak dapat diubah, dinonaktifkan, atau dihapus.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="size-4" />
                Ubah Pengguna
              </Button>

              {user.status === "PENDING" ? (
                <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="size-4 text-amber-600" />
                    Menunggu Google Sign-In Pertama
                  </div>
                  <p>
                    Pengguna telah diundang. Status akan otomatis menjadi <strong>Aktif</strong> saat pengguna pertama kali masuk menggunakan Google Sign-In dengan email <code>{user.email}</code>.
                  </p>
                </div>
              ) : null}

              {user.status === "AKTIF" ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleToggleStatus}
                >
                  <UserX className="size-4" />
                  Nonaktifkan Pengguna
                </Button>
              ) : null}

              {user.status === "NONAKTIF" ? (
                <Button
                  variant="default"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleToggleStatus}
                >
                  <CheckCircle2 className="size-4" />
                  Aktifkan Kembali Pengguna
                </Button>
              ) : null}
            </div>
          )}
        </div>

        {editOpen ? (
          <UserFormDialog
            user={user}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
