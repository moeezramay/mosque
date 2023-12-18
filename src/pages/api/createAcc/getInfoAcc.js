import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to retrieve all data on email match
export default async function GetInfoAcc(req, res) {
  try {
    const content = req.body;
    console.log("content getInfoAcc: ", content);

    if (!content) {
      console.log("content empty no email");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }
    const email = content;

    const result = await sql`SELECT * FROM createAcc WHERE email = ${content};`;

    if (result.error) {
      console.log("Database Error:", result.error);
      return { error: "Database error" };
    }
    console.log("Result recieved from db: ", result);

    res.json({ user: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
