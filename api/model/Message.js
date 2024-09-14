import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Message", messageSchema);
