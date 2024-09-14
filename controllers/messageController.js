import { formatDistanceToNow } from "date-fns";
import mongoose from "mongoose";
import Message from "../model/Message.js";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "board";

function createMessageObject(message, truncateText = false) {
  if (message && message._id) {
    return {
      id: message._id,
      userName: message.userName,
      text: truncateText ? `${message.text.slice(0, 3)}...` : message.text,
      date: formatDistanceToNow(message.updatedAt),
    };
  }
}

async function connectToDB() {
  if (!MONGODB_URI) {
    throw Error(`Environment variable 'MONGODB_URI' is '${MONGODB_URI}'!`);
  }
  const connection = mongoose.connection;
  connection.on("error", (e) => console.log(e));
  connection.once("connected", () => console.log("DB is connected"));
  connection.once("disconnected", () => {
    console.log("DB is disconnected");
    connection.removeAllListeners();
  });
  await mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 15000,
  });
  return connection;
}

async function getAllMessages(req, res) {
  res.locals.title = "Odin Mini Message Board";
  let connection;
  try {
    connection = await connectToDB();
    const allMessages = await Message.find({});
    res.locals.messages = allMessages.map((message) =>
      createMessageObject(message, true)
    );
  } catch (error) {
    console.log(error);
    res.locals.errorMessage = "Could not retrieve any messages!";
  } finally {
    if (connection) {
      connection.close();
    }
    res.render("index");
  }
}

function validateInputs(name, message) {
  if (!name || !message) {
    return encodeURIComponent("All fields are required!");
  } else if (name.length > 28) {
    return encodeURIComponent("Your name is too long!");
  }
  return "";
}

async function keepDBShort() {
  try {
    const allMessages = await Message.find({});
    if (allMessages.length > 64) {
      const deleted = await Message.findByIdAndDelete(allMessages[0]._id);
      console.log(`first Entry deleted => ${deleted}`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function createNewMessage(req, res) {
  const newMessage = {
    userName: req.body["user-name"],
    text: req.body.message,
  };
  const encodedErrorMessage = validateInputs(
    newMessage.userName,
    newMessage.text
  );
  if (encodedErrorMessage) {
    res.redirect(`${req.originalUrl}?err=${encodedErrorMessage}`);
  } else {
    let connection;
    try {
      connection = await connectToDB();
      await Message.create(newMessage);
      await keepDBShort();
      res.redirect("/");
    } catch (error) {
      console.log(error);
      const errorMessage = "Failed to send your message!";
      res.redirect(
        `${req.originalUrl}?err=${encodeURIComponent(errorMessage)}`
      );
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }
}

async function getMessageDetails(req, res) {
  res.locals.title = "Message Details";
  const id = req.params.id;
  let connection;
  try {
    connection = await connectToDB();
    res.locals.message = await Message.findById(id);
  } catch (error) {
    console.log(error);
    res.status(404);
    res.locals.errorMessage = "Could not retrieve message data!";
  } finally {
    if (connection) {
      connection.close();
    }
    res.render("message-details");
  }
}

function getNewMessageFrom(req, res) {
  res.render("new-message", { title: "Add New Message" });
}

export default {
  createNewMessage,
  getNewMessageFrom,
  getMessageDetails,
  getAllMessages,
};
