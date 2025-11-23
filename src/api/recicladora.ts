import { Router } from "express";
import { fetchRecicladoras } from "./../utils/google";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await fetchRecicladoras();
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
