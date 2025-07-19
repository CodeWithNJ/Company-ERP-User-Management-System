import express from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config({
  path: "./.env",
});

// Middlewares
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

export default app;
