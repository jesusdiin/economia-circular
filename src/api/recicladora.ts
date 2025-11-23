import { Router } from "express";
import { fetchAllRecicladoras, fetchByCategory, fetchPlaceById } from "./../utils/google.js";

const router = Router();

// Obtener todas las categorías completas
router.get("/", async (req, res) => {
  try {
    const data = await fetchAllRecicladoras();
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener solo una categoría (ej: vidrio, madera, acero, etc.)
router.get("/:categoria", async (req, res) => {
  try {
    const categoria = req.params.categoria.toLowerCase();
    const data = await fetchByCategory(categoria);
    res.status(200).json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Obtener un lugar por ID
router.get("/id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetchPlaceById(id);
    res.status(200).json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
