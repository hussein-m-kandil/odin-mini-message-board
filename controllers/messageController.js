import { formatDistanceToNow } from "date-fns";
import messages from "../model/messages.js";

export default {
  getAllMessages(req, res) {
    res.render("index", {
      title: "Odin Mini Message Board",
      formatDate: formatDistanceToNow,
      messages,
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
