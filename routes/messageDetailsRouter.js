import express from "express";
import messageController from "../controllers/messageController.js";

const router = express.Router();

router.get("/:id", messageController.getMessageDetails);

export default router;
