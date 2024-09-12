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
};
