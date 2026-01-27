import express from "express";
import { handleAuth , getUser } from "../controllers/authController.js"; 

const router = express.Router();

import { authIdentity } from "../middleware/authIdentity.js";
import { userRateLimiter } from "../middleware/userRateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";

router.use(authIdentity);
router.use(userRateLimiter);

router.post("/login", handleAuth);
router.get("/getUser", protect , getUser);

export default router; 
