import { Column, JobApplication } from "@/lib/models/models.types";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
}

export default function JobApplicationCard({
  job,
  columns,
}: JobApplicationCardProps) {
  return <div></div>;
}
