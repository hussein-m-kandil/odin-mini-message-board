import process from "process";
import express from "express";
import messageBoardRouter from "./routes/messageBoardRouter.js";
import newMessageRouter from "./routes/newMessageRouter.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.use("/", messageBoardRouter);
app.use("/new", newMessageRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
