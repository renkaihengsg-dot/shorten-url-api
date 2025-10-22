import { Router } from "express";

import { shortenUrl, getUrl } from "#controllers/url.controller.js";

const router = Router();
router.post("/shorten", shortenUrl);
router.get("/:shortCode", getUrl);

export default router;
