import path from "path";
import process from "process";
import express from "express";
import newMessageRouter from "./routes/newMessageRouter.js";
import messageBoardRouter from "./routes/messageBoardRouter.js";
import messageDetailsRouter from "./routes/messageDetailsRouter.js";

const PUBLIC_DIR = path.join(process.cwd(), "api/public");

const app = express();

app.set("views", path.join(process.cwd(), "api/views"));
app.set("view engine", "ejs");

app.use(express.static(PUBLIC_DIR));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.use("/", messageBoardRouter);
app.use("/new", newMessageRouter);
app.use("/details", messageDetailsRouter);

export default app;
