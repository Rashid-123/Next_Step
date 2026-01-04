import express from "express";
import { handleAuth , getUser } from "../controllers/authController.js"; 
import {protect} from "../middleware/authMiddleware.js"
const router = express.Router();

router.post("/login", handleAuth);
router.get("/getUser", protect , getUser);

export default router; 
