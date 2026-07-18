import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./routes/authRoutes.js";
import { resourceRouter } from "./routes/resourceRoutes.js";
import { taskRouter } from "./routes/taskRoutes.js";
import { streakRouter } from "./routes/streakRoutes.js";
import { projectIdeaRouter } from "./routes/projectIdeaRoutes.js";
import { jobApplicationRouter } from "./routes/jobApplicationRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/resources", resourceRouter);
  app.use("/api/tasks", taskRouter);
  app.use("/api/streaks", streakRouter);
  app.use("/api/project-ideas", projectIdeaRouter);
  app.use("/api/job-applications", jobApplicationRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
