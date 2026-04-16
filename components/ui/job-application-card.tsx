"use client";
import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./card";
import {
  Edit2,
  ExternalLink,
  MoreVertical,
  Plus,
  Trash2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./dropdown-menu";
import { Button } from "./button";
import { updateJobApplication } from "@/lib/action/job-application";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
}

export default function JobApplicationCard({
  job,
  columns,
}: JobApplicationCardProps) {
  async function handleMove(newColumnId: string) {
    const result = await updateJobApplication(job._id, {
      columnId: newColumnId,
    });
    try {
    } catch (error) {
      console.error("Fail to move application", error);
    }
  }
  return (
    <>
      <Card className="cursor-pointer transition-shadow hover:shadow-2xl">
        <CardContent className="p-4">
          <div className="flex flex-start justify-between gap-2">
            <div className="">
              <h3 className="font-bold text-sm mb-1">{job.position}</h3>
              <p className="text-xs mb-2 text-muted-foreground">
                {job.company}
              </p>
              {job.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {job.description}
                </p>
              )}
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {job.tags.map((tag, key) => (
                    <span
                      className="px-2 py-0.5 text-xs rounded-full bg-blue-200"
                      key={key}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {job.jobUrl && (
                <a
                  target="blank"
                  href={job.jobUrl}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink />
                </a>
              )}
            </div>

            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit2 />
                    Edit
                  </DropdownMenuItem>
                  {columns.length > 1 && (
                    <>
                      {columns
                        .filter((c) => c._id !== job.columnId)
                        .map((column, key) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => handleMove(column._id)}
                          >
                            Move to {column.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}

                  <DropdownMenuItem>
                    <Trash2Icon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
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
                <Label
                  htmlFor="description"
                  className="text-gray-800 font-bold"
                >
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
