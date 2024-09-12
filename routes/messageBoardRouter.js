import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Welcome to Odin Mini Message Board</h1>");
});

export default router;
