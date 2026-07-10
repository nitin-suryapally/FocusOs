import { createApp } from "./app.js";
import { connectToDatabase } from "./db/connect.js";
import { env } from "./config/env.js";

const startServer = async () => {
  await connectToDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
