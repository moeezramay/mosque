import excuteQuery from "@/lib/db";

const dotenv = require("dotenv");
dotenv.config();

//Function To Send Message
export default async function SendMessage(req, res) {
  try {
    console.log("Message Content: ", req.body);
    const content = req.body;

    console.log("content: ", content);
    if (!content) {
      console.log("content empty");
      res
        .status(400)
        .json({ error: "Content cannot be empty on send message." });
      return;
    }
    const senderEmail = content.senderEmail;
    const receiverEmail = content.receiverEmail;
    const messageText = content.messageText;

    const updateQuery = `
    INSERT INTO messages (sender_email, receiver_email, message_text)
    VALUES (?, ?, ?)
  `;
    const values = [senderEmail, receiverEmail, messageText];

    const result = await excuteQuery({
      query: updateQuery,
      values,
    });
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
