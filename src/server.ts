import app from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";

async function main() {
  await prisma.$connect();
  app.listen(config.port, () => {
    console.log(`RentNest API running on port ${config.port} [${config.nodeEnv}]`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
