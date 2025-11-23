import express from "express";
import recicladoras from "../api/recicladora";
import serverless from "serverless-http";

const app = express();
app.use("/api/recicladoras", recicladoras);

// Export para vercel
export const handler = serverless(app);
