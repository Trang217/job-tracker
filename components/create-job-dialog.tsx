import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          className="w-full mb-4 justify-start text-muted-foreground font-bold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-gray-800">
            Add Job Application
          </DialogTitle>
          <DialogDescription>Track a new job application</DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-800 font-bold">
                  Company *
                </Label>
                <Input id="company" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-gray-800 font-bold">
                  Position *
                </Label>
                <Input id="position" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-800 font-bold">
                  Location{" "}
                </Label>
                <Input id="location" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-gray-800 font-bold">
                  Salary{" "}
                </Label>
                <Input id="salary" placeholder="e.g., 40k Eur" />
              </div>
            </div>

            <div className="">
              <Label htmlFor="jobUrl" className="text-gray-800 font-bold">
                Job URL{" "}
              </Label>
              <Input id="jobUrl" placeholder="https://..." />
            </div>

            <div className="">
              <Label htmlFor="tags" className="text-gray-800 font-bold">
                Tags (comma-separated)
              </Label>
              <Input id="tags" placeholder="React, Tailwind,v.v." />
            </div>

            <div className="">
              <Label htmlFor="description" className="text-gray-800 font-bold">
                Description
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief description of the role..."
              />
            </div>

            <div className="">
              <Label htmlFor="note" className="text-gray-800 font-bold">
                Note
              </Label>
              <Textarea id="note" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="font-bold text-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-rose-400 font-bold px-3 py-2">
              Add Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
