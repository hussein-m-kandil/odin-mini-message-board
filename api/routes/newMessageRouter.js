import express from "express";
import messageController from "../controllers/messageController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
  if (req.query.err) {
    if (!Array.isArray(req.query.err)) {
      res.locals.errorMessage = req.query.err;
    }
  }
  next();
});

router.get("/", messageController.getNewMessageFrom);

router.use(express.urlencoded({ extended: true }));

router.post("/", messageController.createNewMessage);

export default router;
