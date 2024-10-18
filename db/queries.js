const pool = require("./pool.js");

module.exports = {
  async readAllMessages() {
    return await pool.query("SELECT * FROM messages");
  },

  async readMessage(id) {
    return await pool.query("SELECT * FROM messages WHERE id = $1", [id]);
  },

  async createMessage(sender, message) {
    return await pool.query(
      "INSERT INTO messages (sender, message) VALUES ($1, $2)",
      [sender, message]
    );
  },

  async limitMessages() {
    const LIMIT = 100;
    const entries = (await pool.query("SELECT * FROM messages")).rows;
    if (entries.length > LIMIT) {
      await pool.query("DELETE FROM messages");
      await pool.query("ALTER SEQUENCE messages_id_seq RESTART");
      for (let i = 1; i < entries.length; i++) {
        const entry = entries[i];
        await pool.query(
          "INSERT INTO messages (sender, message, created_at) VALUES ($1, $2, $3)",
          [entry["sender"], entry["message"], entry["created_at"]]
        );
      }
    }
  },
};
