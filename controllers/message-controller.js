const { formatDistanceToNow } = require("date-fns");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries.js");

const NEW_MESSAGE_TEMPLATE = "new-message";
const NEW_MESSAGE_TITLE = "New Message";
const MESSAGE_DETAILS_TEMPLATE = "message-details";
const MESSAGE_DETAILS_TITLE = "Message Details";

const createMessageObject = (row, truncateText = false) => {
  return {
    id: row.id,
    sender: row.sender,
    message: truncateText ? `${row.message.slice(0, 3)}...` : row.message,
    date: formatDistanceToNow(row["created_at"]),
  };
};

const getMessages = async (req, res) => {
  res.locals.title = "Odin Mini Message Board";
  try {
    res.locals.messages = (await db.readAllMessages()).rows.map((row) =>
      createMessageObject(row, true)
    );
  } catch (error) {
    console.log(error);
    res.locals.error = "Could not retrieve any messages!";
    res.status(500);
  }
  res.render("index");
};

const getMessage = async (req, res) => {
  res.locals.title = MESSAGE_DETAILS_TITLE;
  try {
    const message = createMessageObject(
      (await db.readMessage(req.params.id)).rows[0]
    );
    return res.render(MESSAGE_DETAILS_TEMPLATE, { message });
  } catch (error) {
    console.log(error);
    res.status(404).render(MESSAGE_DETAILS_TEMPLATE, {
      error: "Could not retrieve message data!",
    });
  }
};

const getCreateMessage = (req, res) => {
  res.render(NEW_MESSAGE_TEMPLATE, { title: NEW_MESSAGE_TITLE });
};

const validateInputs = [
  body("sender")
    .trim()
    .isLength({ min: 1, max: 28 })
    .withMessage("Your name length must be between 1 and 28 (inclusive)!")
    .isAlpha()
    .withMessage("Your name must contain letters only!"),
  body("message")
    .trim()
    .isLength({ min: 1, max: 999 })
    .withMessage("Your message length must be between 1 and 999 (inclusive)!"),
];

const postCreateMessage = [
  validateInputs,
  async (req, res) => {
    res.locals.title = NEW_MESSAGE_TITLE;
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res
        .status(400)
        .render(NEW_MESSAGE_TEMPLATE, {
          errors: validationErrors.mapped(),
          ...req.body,
        });
    }
    try {
      await db.createMessage(req.body["sender"], req.body["message"]);
      await db.limitMessages();
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.status(500).render(NEW_MESSAGE_TEMPLATE, {
        serverError: "Failed to send your message! Try again later.",
        ...req.body,
      });
    }
  },
];

module.exports = {
  getMessage,
  getMessages,
  getCreateMessage,
  postCreateMessage,
};
