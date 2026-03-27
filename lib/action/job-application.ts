"use server";

import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  note?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
  boardId: string;
  columnId: string;
}

export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  const {
    company,
    position,
    location,
    salary,
    note,
    tags,
    description,
    jobUrl,
    boardId,
    columnId,
  } = data;

  if (!company || !position || !boardId || columnId) {
    return { error: "Missing required fields" };
  }

  // Verify board ownership
  const board = await Board.findOne({ _id: boardId, userId: session.user.id });

  if (!board) {
    return { error: "Could not find Board" };
  }

  // Verify column belong board

  const column = await Column.findOne({ _id: columnId, boardId: boardId });

  if (!column) {
    return { error: "Could not find Column" };
  }

  // Create Jon Application

  const maxOrder = (await JobApplication.findOne({ columnId: columnId })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;

  const jobApplication = await JobApplication.create({
    company,
    position,
    location,
    salary,
    note,
    tags,
    description,
    jobUrl,
    boardId,
    columnId,
    status: "applied",
    order: maxOrder ? maxOrder.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: jobApplication._id },
  });

  return { data: jobApplication };
}
