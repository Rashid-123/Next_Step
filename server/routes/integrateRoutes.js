import express from 'express';

import {integrate_Leetcode } from "../controllers/integrateController.js"

import { authIdentity } from "../middleware/authIdentity.js";
import { userRateLimiter } from "../middleware/userRateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authIdentity); // token --> uid
router.use(userRateLimiter); // userid rate limit
router.use(protect); // DB Lookup

console.log("Ingegrate Routes loaded");

router.put ("/leetcode"  , integrate_Leetcode);


export default router;