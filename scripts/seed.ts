import connectDB from "../lib/db";
import "@/lib/models";
import { Board, Column, JobApplication } from "@/lib/models";

const USER_ID = "69c55b7d957725f45b6e83fd";

const SAMPLE_JOBS = [
  // Wish List
  {
    company: "Zalando SE",
    position: "Frontend Developer",
    location: "Berlin, Germany",
    tags: ["React", "TypeScript", "Next.js"],
    description:
      "Develop scalable frontend applications and improve user experience for e-commerce platform",
    jobUrl: "https://de.indeed.com/viewjob?jk=zalando-frontend",
    salary: "55k - 70k",
  },
  {
    company: "CHECK24",
    position: "Frontend Engineer",
    location: "München, Germany",
    tags: ["JavaScript", "React", "Redux"],
    description:
      "Build and optimize high-performance web applications with focus on UI/UX",
    jobUrl: "https://de.indeed.com/viewjob?jk=check24-frontend",
    salary: "50k - 65k",
  },
  {
    company: "About You",
    position: "Web Developer",
    location: "Hamburg, Germany",
    tags: ["React", "TypeScript", "CSS"],
    description:
      "Implement modern UI components and improve frontend architecture",
    jobUrl: "https://de.indeed.com/viewjob?jk=aboutyou-web",
    salary: "48k - 60k",
  },

  // Applied
  {
    company: "Trivago",
    position: "Frontend Developer",
    location: "Düsseldorf, Germany",
    tags: ["React", "TypeScript", "Performance"],
    description: "Develop responsive web applications and optimize performance",
    jobUrl: "https://de.indeed.com/viewjob?jk=trivago-frontend",
    salary: "55k - 70k",
  },
  {
    company: "Sixt GmbH",
    position: "Frontend Developer",
    location: "München, Germany",
    tags: ["JavaScript", "Vue", "CSS"],
    description:
      "Create user-friendly interfaces and improve booking experience",
    jobUrl: "https://de.indeed.com/viewjob?jk=sixt-frontend",
    salary: "50k - 65k",
  },
  {
    company: "Celonis",
    position: "Software Engineer Frontend",
    location: "München, Germany",
    tags: ["React", "TypeScript", "Data Visualization"],
    description: "Build data-driven dashboards and interactive UI components",
    jobUrl: "https://de.indeed.com/viewjob?jk=celonis-frontend",
    salary: "60k - 75k",
  },

  // Interviewing
  {
    company: "Deersoft GmbH",
    position: "Web Developer",
    location: "Berlin, Germany",
    tags: ["React", "Figma", "MUI"],
    description: "Develop and maintain web applications and UI components",
    jobUrl: "https://de.indeed.com/viewjob?jk=deersoft-web",
    salary: "40k - 50k",
  },
  {
    company: "IONOS",
    position: "Frontend Developer",
    location: "Karlsruhe, Germany",
    tags: ["JavaScript", "TypeScript", "Accessibility"],
    description:
      "Improve frontend systems with focus on accessibility and performance",
    jobUrl: "https://de.indeed.com/viewjob?jk=ionos-frontend",
    salary: "50k - 65k",
  },

  // Offer
  {
    company: "SAP",
    position: "Frontend Developer",
    location: "Walldorf, Germany",
    tags: ["React", "TypeScript", "Enterprise"],
    description: "Develop enterprise-level web applications and UI systems",
    jobUrl: "https://de.indeed.com/viewjob?jk=sap-frontend",
    salary: "60k - 80k",
  },

  // Rejected
  {
    company: "Otto Group",
    position: "Web Developer",
    location: "Hamburg, Germany",
    tags: ["JavaScript", "CSS", "HTML"],
    description: "Develop and maintain e-commerce frontend features",
    jobUrl: "https://de.indeed.com/viewjob?jk=otto-web",
    salary: "45k - 55k",
  },
  {
    company: "1&1",
    position: "Frontend Engineer",
    location: "Montabaur, Germany",
    tags: ["React", "Performance", "Testing"],
    description: "Work on scalable frontend systems and optimize performance",
    jobUrl: "https://de.indeed.com/viewjob?jk=1und1-frontend",
    salary: "48k - 60k",
  },
];

async function seed() {
  if (!USER_ID) {
    console.error("❌ Error: SEED_USER_ID environment variable is required");
    console.log("Usage: SEED_USER_ID=your-user-id npm run seed");
    process.exit(1);
  }

  try {
    console.log("🌱 Starting seed process...");
    console.log(`📋 Seeding data for user npm runID: ${USER_ID}`);

    await connectDB();
    console.log("✅ Connected to database");

    // Find the user's board
    let board = await Board.findOne({ userId: USER_ID, name: "Job Hunt" });

    if (!board) {
      console.log("⚠️  Board not found. Creating board...");
      const { initializeUserBoard } = await import("../lib/init-user-board");
      board = await initializeUserBoard(USER_ID);
      console.log("✅ Board created");
    } else {
      console.log("✅ Board found");
    }

    // Get all columns
    const columns = await Column.find({ boardId: board._id }).sort({
      order: 1,
    });
    console.log(`✅ Found ${columns.length} columns`);

    if (columns.length === 0) {
      console.error(
        "❌ No columns found. Please ensure the board has default columns.",
      );
      process.exit(1);
    }

    // Map column names to column IDs
    const columnMap: Record<string, string> = {};
    columns.forEach((col) => {
      columnMap[col.name] = col._id.toString();
    });

    // Clear existing job applications for this user
    const existingJobs = await JobApplication.find({ userId: USER_ID });
    if (existingJobs.length > 0) {
      console.log(
        `🗑️  Deleting ${existingJobs.length} existing job applications...`,
      );
      await JobApplication.deleteMany({ userId: USER_ID });

      // Clear job applications from columns
      for (const column of columns) {
        column.jobApplications = [];
        await column.save();
      }
    }

    // Distribute jobs across columns
    const jobsByColumn: Record<string, typeof SAMPLE_JOBS> = {
      "Wish List": SAMPLE_JOBS.slice(0, 3),
      Applied: SAMPLE_JOBS.slice(3, 7),
      Interviewing: SAMPLE_JOBS.slice(7, 10),
      Offer: SAMPLE_JOBS.slice(10, 12),
      Rejected: SAMPLE_JOBS.slice(12, 15),
    };

    let totalCreated = 0;

    for (const [columnName, jobs] of Object.entries(jobsByColumn)) {
      const columnId = columnMap[columnName];
      if (!columnId) {
        console.warn(`⚠️  Column "${columnName}" not found, skipping...`);
        continue;
      }

      const column = columns.find((c) => c.name === columnName);
      if (!column) continue;

      for (let i = 0; i < jobs.length; i++) {
        const jobData = jobs[i];
        const jobApplication = await JobApplication.create({
          company: jobData.company,
          position: jobData.position,
          location: jobData.location,
          tags: jobData.tags,
          description: jobData.description,
          jobUrl: jobData.jobUrl,
          salary: jobData.salary,
          columnId: columnId,
          boardId: board._id,
          userId: USER_ID,
          status: columnName.toLowerCase().replace(" ", "-"),
          order: i,
        });

        column.jobApplications.push(jobApplication._id);
        totalCreated++;
      }

      await column.save();
      console.log(`✅ Added ${jobs.length} jobs to "${columnName}" column`);
    }

    console.log(`\n🎉 Seed completed successfully!`);
    console.log(`📊 Created ${totalCreated} job applications`);
    console.log(`📋 Board: ${board.name}`);
    console.log(`👤 User ID: ${USER_ID}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
