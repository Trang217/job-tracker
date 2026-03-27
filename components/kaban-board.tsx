"use client";

import { Board, Column } from "@/lib/models/models.types";
import { Award, Calendar, CheckCircle2, Mic, XCircle } from "lucide-react";
import React from "react";
import { Card } from "./ui/card";

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
}

function DroppableColumn({ column, config, boardId }: DroppableColumnProp) {
  return <Card></Card>;
}
export default function KabanBoard({ board, userId }: KabanBoardProps) {
  const columns = board.columns;
  console.log("columns+++", columns);
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
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
