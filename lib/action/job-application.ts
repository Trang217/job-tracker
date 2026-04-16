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

export async function updateJobApplication(
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

  // Finding job application we want to update
  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    return { error: "Job application not found!" };
  }

  // Check if loged-in user is user in the job application

  if (jobApplication.userId !== session.user.id) {
    return {
      error: "Unauthorized",
    };
  }

  // get what updates from arguments
  const { columnId, order, ...otherUpdated } = updates;

  const updateToApply: Partial<{
    company: string;
    position: string;
    location: string;
    note: string;
    salary: string;
    jobUrl: string;
    tags: string[];
    description: string;
    columnId: string;
    order: number;
  }> = otherUpdated;

  const currentColumnId = jobApplication.columnId.toString();
  const newColumnId = columnId?.toString();

  const isMovingToDifferentColumn =
    newColumnId && newColumnId !== currentColumnId;

  if (isMovingToDifferentColumn) {
    // delete job in the old column, pull is remove an item from array by passing id
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { jobApplications: id },
    });

    // get all the jobs in the column we want to move the job in excluding the job that we move
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
      // when order is null or undefined
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
      $push: { jobApplications: id },
    });
  } else if (order !== undefined && order !== null) {
    // if job is moving in the same column
    const otherJobsInColumn = await JobApplication.find({
      columnId: currentColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    // find the job position currently in the list
    const currentJobOrder = jobApplication.order || 0;
    const currentPositionIndex = otherJobsInColumn.findIndex(
      (job) => job.order > currentJobOrder,
    );

    const oldPositionIndex =
      currentPositionIndex === -1
        ? otherJobsInColumn.length
        : currentPositionIndex;

    const newOrderValue = order * 100;
    if (order < oldPositionIndex) {
      const jobsToShiftDown = otherJobsInColumn.slice(order, oldPositionIndex);

      for (const job of jobsToShiftDown) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + 100 },
        });
      }
    } else if (order > oldPositionIndex) {
      const jobsToShiftUp = otherJobsInColumn.slice(oldPositionIndex, order);

      for (const job of jobsToShiftUp) {
        const newOrder = Math.max(0, job.order - 100);
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: newOrder },
        });
      }
    }

    updateToApply.order = newOrderValue;
  }

  const updated = await JobApplication.findByIdAndUpdate(id, updateToApply, {
    new: true,
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(updated)) };
}
