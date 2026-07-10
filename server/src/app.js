import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./routes/authRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
