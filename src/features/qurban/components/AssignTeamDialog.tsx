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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQurban } from "../store";
import { RESPONSIBILITY_LABEL } from "../constants";
import type { Animal, ResponsibilityKind } from "../types";

export function AssignTeamDialog({
  animal,
  kind,
  open,
  onOpenChange,
}: {
  animal: Animal;
  kind: ResponsibilityKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { teamsFor, assignTeam } = useQurban();
  const responsibility = animal.responsibilities[kind];
  const [teamId, setTeamId] = useState(responsibility.teamId ?? "");
  const teams = teamsFor(kind);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign team</DialogTitle>
          <DialogDescription>
            {animal.code} — {RESPONSIBILITY_LABEL[kind]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="team">Operational team</Label>
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger id="team">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!teamId}
            onClick={() => {
              assignTeam(animal.id, kind, teamId);
              onOpenChange(false);
              toast.success(`${animal.code} assigned`, {
                description: `${RESPONSIBILITY_LABEL[kind]} → ${
                  teams.find((team) => team.id === teamId)?.name ?? ""
                }`,
              });
            }}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}