// Server startup file

import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import prisma from "./config/prisma.js";
import initializeSocket from "./services/socket/index.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : process.env.NODE_ENV === 'testing' ? '.env.testing' : '.env.development';
// dotenv.config({path:path.join(process.cwd(), envFile)})
import "./config/env.js";
import "./config/validateEnv.js";

const PORT = process.env.PORT;
console.log(PORT);

// Test Prisma connection
async function testPrismaConnection() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Database connection successfull");
  } catch (error) {
    console.error("✗ Database connection failed:", error.message);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await testPrismaConnection();
    const server = http.createServer(app);
    const io = await initializeSocket(server);

    server.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`,
      );
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM signal received: closing HTTP server");
      io.close();
      server.close(async () => {
        console.log("HTTP server closed");
        await prisma.$disconnect();
        console.log("Prisma disconnected");
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT signal received: closing HTTP server");
      io.close();
      server.close(async () => {
        console.log("HTTP server closed");
        await prisma.$disconnect();
        console.log("Prisma disconnected");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    //  io.close()
    process.exit(1);
  }
}

startServer();
