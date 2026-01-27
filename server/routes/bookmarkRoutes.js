import express from   "express";
import {
  getallBookmarks,
  toggleBookmark,
} from "../controllers/bookmarkController.js";

import { authIdentity } from "../middleware/authIdentity.js";
import { userRateLimiter } from "../middleware/userRateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authIdentity); // token --> uid
router.use(userRateLimiter); // userid rate limit
router.use(protect); // DB Lookup

router.post("/", toggleBookmark);
router.get("/", getallBookmarks); 


export default router;