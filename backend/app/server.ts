import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { parsedEnv } from "./config/env";
import connectDB from "./config/database";
import apiRouter from "./index";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import compression from 'compression';
import { monitoringMiddleware, promClient } from './monitoring';

dotenv.config();
const app = express();
const allowedOrigins = parsedEnv.ALLOWED_ORIGINS;

// Check the origin
app.use((req, _res, next) => {
  console.log("Incoming Origin:", req.get("Origin"));
  next();
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());

if (parsedEnv.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(compression({
  level: 6,
  threshold: 1024
}));

// Remove the X-Powered-By header to hide server information
app.disable('x-powered-by');

// Security headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self'; " +
    "font-src 'self'; " +
    "object-src 'none'; " +
    "frame-ancestors 'none';"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(monitoringMiddleware);

app.use(cookieParser());

// Metrics endpoint (MUST be before other routes)
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Root health‑check
app.get("/", (_req, res) => {
  res.json(`Hi, this eventflow server API is running on port ${parsedEnv.PORT}`);
});

app.use("/api", apiRouter);

// Uncomment if Swagger is needed
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

(async () => {
  try {
    await connectDB();
    app.listen(parsedEnv.PORT, () => {
      console.log(`⚡  Server ready  →  http://localhost:${parsedEnv.PORT}`);
    });
  } catch (err) {
    console.error("❌  Startup failed:", err);
    process.exit(1);
  }
})();

export default app;