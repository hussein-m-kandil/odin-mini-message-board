import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Here you can add new message</h1>");
});

export default router;
