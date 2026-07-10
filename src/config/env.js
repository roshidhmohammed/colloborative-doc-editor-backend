import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV;

const envFiles = {
  development: "../../.env.development",
  production: "../../.env.production",
  testing: "../../.env.testing",
};

dotenv.config({
  path: path.resolve(__dirname, envFiles[env]),
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
// DIRECT_URL: process.env.DIRECT_URL
};