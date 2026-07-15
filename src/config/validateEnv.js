const requiredVariables = ["NODE_ENV", "PORT", "DATABASE_URL", "JWT_SECRET"];

requiredVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

console.log("Environment variables validated.");
