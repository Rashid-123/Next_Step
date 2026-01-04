import express from "express";

import { create_order   } from "../controllers/paymentController.js";
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();


router.post("/create-order",protect, create_order);

export default router;