"use client";
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
import { useState } from "react";

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    note: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-800 font-bold">
                  Company *
                </Label>
                <Input
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-gray-800 font-bold">
                  Position *
                </Label>
                <Input
                  id="position"
                  required
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-800 font-bold">
                  Location{" "}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-gray-800 font-bold">
                  Salary{" "}
                </Label>
                <Input
                  id="salary"
                  placeholder="e.g., 40k Eur"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl" className="text-gray-800 font-bold">
                Job URL{" "}
              </Label>
              <Input
                id="jobUrl"
                placeholder="https://..."
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-800 font-bold">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                placeholder="React, Tailwind,v.v."
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-800 font-bold">
                Description
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief description of the role..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-gray-800 font-bold">
                Note
              </Label>
              <Textarea
                id="note"
                rows={4}
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="font-bold text-gray-800 hover:text-rose-400 px-3"
              onClick={() => setOpen(false)}
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
