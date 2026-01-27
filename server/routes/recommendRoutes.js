import express from "express";

import {
  createRecommendation,
  getRecommendation,
  getAllRecommendations,
} from "../controllers/recommendationController.js";

import { authIdentity } from "../middleware/authIdentity.js";
import { userRateLimiter } from "../middleware/userRateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authIdentity); // token --> uid
router.use(userRateLimiter); // userid rate limit
router.use(protect); // DB Lookup

router.post("/", protect, createRecommendation);
router.get("/all", protect, getAllRecommendations);
router.get("/:id", protect, getRecommendation);


export default router;