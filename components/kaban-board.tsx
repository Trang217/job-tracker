"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-dialog";

interface KabanBoardProps {
  board: Board;
  userId: string;
}

interface Config {
  color: string;
  icon: React.ReactNode;
}

const COLUMN_CONFIG: Array<Config> = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },

  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
];

interface DroppableColumnProp {
  column: Column;
  config: Config;
  boardId: string;
  sortedColumns: Column[];
}

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: DroppableColumnProp) {
  const sortedJobs =
    column.jobApplications.sort((a, b) => a.order - b.order) || [];
  return (
    <Card className="min-w-75 flex-0 shadow-md p-0">
      <CardHeader
        className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-amber-50 text-base font-bold">
              {column.name}
            </CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-amber-50 hover:bg-amber-50/20"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-4 bg-gray-50/50 min-h-100 rounded-b-lg">
        {sortedJobs.map((job, key) => {
          return (
            <JobCard
              key={key}
              job={{ ...job, columnId: job.columnId || column._id }}
              columns={}
            />
          );
        })}
        <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}

function JobCard({
  job,
  columns,
}: {
  job: JobApplication;
  columns: Column[];
}) {}

export default function KabanBoard({ board, userId }: KabanBoardProps) {
  const columns = board.columns;
  const sortedColumns = columns.sort((a, b) => a.order - b.order) || [];

  return (
    <>
      <div className="">
        <div className="">
          {columns.map((col, key) => {
            const config = COLUMN_CONFIG[key] || {
              color: "bg-cyan-500",
              icon: <Calendar className="h-4 w-4" />,
            };
            return (
              <DroppableColumn
                key={key}
                column={col}
                config={config}
                boardId={board._id}
                sortedColumns={sortedColumns}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
