import { formatDistanceToNow } from "date-fns";
import messages from "../model/messages.js";

export default {
  getMessageDetails(req, res) {
    const id = req.params.id;
    if (id && id < messages.length) {
      const msg = messages[id];
      res.render("message-details", {
        title: "Message Details",
        message: { ...msg, date: formatDistanceToNow(msg.date) },
      });
    } else {
      res.redirect("/");
    }
  },

  getAllMessages(req, res) {
    res.render("index", {
      title: "Odin Mini Message Board",
      messages: messages.map((msg) => {
        const formattedDate = formatDistanceToNow(msg.date);
        const messageText = `${msg.text.slice(0, 2)}...`;
        return { ...msg, text: messageText, date: formattedDate };
      }),
    });
  },

  getNewMessageFrom(req, res) {
    res.render("new-message", { title: "Add New Message" });
  },

  createNewMessage(req, res) {
    const newMessage = {
      userName: req.body["user-name"],
      text: req.body.message,
      date: new Date(),
    };
    let errorMessage;
    if (newMessage.userName && newMessage.text) {
      if (newMessage.userName.length > 28) {
        errorMessage = encodeURIComponent("Your name is too long!");
      }
    } else {
      errorMessage = encodeURIComponent("All fields are required!");
    }
    if (errorMessage) {
      res.redirect(`${req.originalUrl}?err=${errorMessage}`);
    } else {
      messages.push(newMessage);
      res.redirect("/");
    }
  },
};
