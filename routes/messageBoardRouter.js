import express from "express";
import { formatDistanceToNow } from "date-fns";

const messages = [
  {
    text: "Hi there!",
    userName: "Superman",
    date: new Date(),
  },
  {
    text: "Hello World!",
    userName: "Batman",
    date: new Date(),
  },
];

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Odin Mini Message Board",
    formatDate: formatDistanceToNow,
    messages,
  });
});

export default router;
