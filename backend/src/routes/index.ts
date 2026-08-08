import { Router } from "express";
import { analyzeUrl } from "../controllers/analyze.controller";

const router = Router();

router.post("/analyze", analyzeUrl);

export default router;