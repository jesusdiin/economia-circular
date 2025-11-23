import express from "express";
import recicladoras from "./api/recicladora";

const app = express();
app.use("/api/recicladoras", recicladoras);

if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Dev server on http://localhost:${PORT}`);
  });
}

export default app;
