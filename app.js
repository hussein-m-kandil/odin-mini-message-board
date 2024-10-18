const path = require("path");
const process = require("process");
const express = require("express");
const messagesRouter = require("./routes/messages-router.js");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(process.cwd(), "public");

const logger = (req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
};

const app = express();

app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");

app.use(express.static(PUBLIC_DIR));
app.use("/", logger, messagesRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
