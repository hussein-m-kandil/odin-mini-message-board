const path = require("path");
const process = require("process");
const express = require("express");
const messagesRouter = require("./routes/messages-router.js");

const PUBLIC_DIR = path.join(process.cwd(), "api/public");

const logger = (req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
};

const app = express();

app.set("views", path.join(process.cwd(), "api/views"));
app.set("view engine", "ejs");

app.use(express.static(PUBLIC_DIR));
app.use("/", logger, messagesRouter);

module.exports = app;
