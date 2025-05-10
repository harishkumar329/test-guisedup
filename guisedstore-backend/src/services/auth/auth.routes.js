import express from "express";
import { login, signup } from "./auth.controller.js";
import { authLimiter } from "../../middleware/rate-limiter.middleware.js";

const router = express.Router();

router.post("/login", authLimiter, login);
router.post("/signup", authLimiter, signup);

export default router;