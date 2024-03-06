import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function RequestMe(req, res) {
  try {
    //Get email from body
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const status = req.body.approve;

    console.log("Status: ", status);
    console.log("Sender: ", sender);
    console.log("Receiver: ", receiver);

    //Check if email is valid
    if (!status || status === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      const result = await sql`UPDATE requests
      SET status = ${status}
      WHERE sender_email = ${sender}
      AND receiver_email = ${receiver};`;

      res.json("Request updated");
    } catch (error) {
      console.log("Error while inserting into verify table", error);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error on imam/verifyEmail" });
  }
}
