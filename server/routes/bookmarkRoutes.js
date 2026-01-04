import express from   "express";
import {
  getallBookmarks,
  toggleBookmark,
} from "../controllers/bookmarkController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, toggleBookmark);
router.get("/", protect, getallBookmarks); 


export default router;