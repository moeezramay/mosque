import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function Request(req, res) {
  try {
    //Get email from body
    const requested = req.body.viewed;
    const request = req.body.viewer;

    //Check if email is valid
    if (!request || requested === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const view =
        await sql`INSERT INTO requests (sender_email, receiver_email, status)
      SELECT ${request}, ${requested}, null
      WHERE NOT EXISTS (
          SELECT 1 FROM requests
          WHERE sender_email = ${request} AND receiver_email = ${requested}
      );`;

      res.json("Requested");
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
