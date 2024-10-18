const express = require("express");
const messageController = require("../controllers/message-controller.js");

const router = express.Router();

router.get("/", messageController.getMessages);

router.get("/new", messageController.getCreateMessage);

router.use(express.urlencoded({ extended: true }));

router.post("/new", messageController.postCreateMessage);

router.get("/details/:id", messageController.getMessage);

module.exports = router;
