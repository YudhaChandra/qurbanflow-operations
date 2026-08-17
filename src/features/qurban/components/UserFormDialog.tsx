import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQurban } from "../store";
import type { SystemUser, UserRole } from "../types";

function isValidGmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function UserFormDialog({
  user,
  open,
  onOpenChange,
}: {
  user?: SystemUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addUser, updateUser } = useQurban();

  const isEdit = Boolean(user);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isEmailEditable = !isEdit || user?.status === "PENDING";

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<UserRole>(
    user?.role === "SUPER_ADMIN" ? "SUPERVISOR" : (user?.role ?? "KETUA_TIM"),
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSuperAdmin) {
      setError("Akun Super Admin tidak dapat diubah.");
      return;
    }

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!email.trim()) {
      setError("Email Gmail wajib diisi.");
      return;
    }

    if (!isValidGmail(email)) {
      setError("Format email Gmail tidak valid.");
      return;
    }

    if (isEdit && user) {
      const res = updateUser(user.id, {
        name: name.trim(),
        email: isEmailEditable ? email.trim() : user.email,
        role,
      });

      if (!res.success) {
        setError(res.message ?? "Gagal memperbarui pengguna.");
        return;
      }

      toast.success(`Pengguna "${name.trim()}" berhasil diperbarui.`);
    } else {
      addUser({
        name: name.trim(),
        email: email.trim(),
        role: role === "SUPER_ADMIN" ? "KETUA_TIM" : role,
      });
      toast.success(`Pengguna "${name.trim()}" berhasil ditambahkan (Status: Pending).`);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Ubah Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Perbarui informasi akun dan peran pengguna."
                : "Pengguna baru akan secara otomatis berstatus Pending sampai melakukan login Google pertama."}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-name"
                placeholder="Contoh: Muhammad Farhan"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="user-email">
                  Email Gmail <span className="text-destructive">*</span>
                </Label>
                {!isEmailEditable ? (
                  <span className="text-[11px] text-muted-foreground">
                    (Email terkunci setelah pengguna Aktif)
                  </span>
                ) : null}
              </div>
              <Input
                id="user-email"
                type="email"
                placeholder="pengguna@gmail.com"
                value={email}
                disabled={!isEmailEditable}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-role">
                Peran (Role) <span className="text-destructive">*</span>
              </Label>
              <Select
                value={role}
                onValueChange={(val) => {
                  setRole(val as UserRole);
                  setError(null);
                }}
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Pilih peran..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="KETUA_TIM">Ketua Tim</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Setiap pengguna hanya memiliki tepat satu peran. Role Super Admin tidak dapat ditambahkan.
              </p>
            </div>

            {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">{isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
