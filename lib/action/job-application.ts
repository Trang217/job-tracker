"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";
import { error } from "console";
import { Underdog } from "next/font/google";

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

  if (!company || !position || !boardId || !columnId) {
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
    tags: tags || [],
    description,
    jobUrl,
    boardId,
    columnId,
    userId: session.user.id,
    status: "applied",
    order: maxOrder ? maxOrder.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: jobApplication._id },
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(jobApplication)) };
}

async function updateJobApplication(
  id: string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    note?: string;
    salary?: string;
    jobUrl?: string;
    columnId?: string;
    order?: number;
    tags?: string[];
    description?: string;
  },
) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    return { error: "Job application not found!" };
  }

  if (jobApplication.userId !== session.user.id) {
    return {
      error: "Unauthorized",
    };
  }

  const { columnId, order, ...otherUpdated } = updates;

  const updateToApply: Partial<{
    company: string;
    position: string;
    location: string;
    note: string;
    jobUrl: string;
    tags: string[];
    description: string;
    columnId: string;
    order: number;
  }> = otherUpdated;

  const currentColumnId = jobApplication.columnId.toString();
  const newColumnId = columnId?.toString();

  const isMovingToDiffeerentColumn =
    newColumnId && newColumnId !== currentColumnId;

  if (isMovingToDiffeerentColumn) {
    // delete job in the old column
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { jobApplications: id },
    });

    const jobsInTargetColumn = await JobApplication.find({
      columnId: newColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    let newOrderValue: number;
    if (order !== undefined && order !== null) {
      newOrderValue = order * 100;

      const jobsThatNeedToShift = jobsInTargetColumn.slice(order);

      for (const job of jobsThatNeedToShift) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + 100 },
        });
      }
    } else {
      if (jobsInTargetColumn.length > 0) {
        const lastJobOrder =
          jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;

        newOrderValue = lastJobOrder + 100;
      } else {
        newOrderValue = 0;
      }
    }

    updateToApply.columnId = newColumnId;
    updateToApply.order = newOrderValue;

    await Column.findByIdAndUpdate(newColumnId, {
      $push: { jobApplication: id },
    });
  } else if (order !== undefined && order !== null) {
  }
}
