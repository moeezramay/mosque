import excuteQuery from "@/lib/db";

const dotenv = require("dotenv");
dotenv.config();

//Function To Get Message
export default async function RecieveMessage(req, res) {
  try {
    const content = req.body;

    console.log("content: ", content);
    if (!content) {
      console.log("content empty");
      res
        .status(400)
        .json({ error: "Content cannot be empty on send message." });
      return;
    }
    const receiverEmail = content;

    const updateQuery = `
  SELECT *
  FROM messages
  WHERE receiver_email = ?;
`;
    const values = [receiverEmail];

    const result = await excuteQuery({
      query: updateQuery,
      values,
    });
    console.log("SENDER: ", result);

    res.json({
      message: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
