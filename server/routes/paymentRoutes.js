import express from "express";

import { create_order   } from "../controllers/paymentController.js";
import { authIdentity } from "../middleware/authIdentity.js";
import { userRateLimiter } from "../middleware/userRateLimiter.js";
import { paymentRateLimiter } from "../middleware/paymentRateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authIdentity); // token --> uid
// router.use(userRateLimiter); // userid rate limit
// ------- here payment rate-limiter is used which provide global as well as user wise limit
//  to prevent the merchent(RAZORPAY) Rate_limit issue -----------
router.use(paymentRateLimiter)
router.use(protect); // DB Lookup

router.post("/create-order", create_order);

export default router;