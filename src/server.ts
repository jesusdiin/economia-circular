import express from "express";
import recicladoras from "./api/recicladora.js";
import 'dotenv/config';


const app = express();

app.use("/api/recicladoras", recicladoras);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dev server running on http://localhost:${PORT}`);
});
