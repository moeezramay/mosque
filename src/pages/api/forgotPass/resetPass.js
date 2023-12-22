import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to check if email exists
export default async function CheckEmail(req, res) {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    console.log("body recieved on reset", req.body);

    if (!email) {
      console.log("content empty no email no pass on resetPass api");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }
    if (!pass) {
      console.log("content empty no email no pass on resetPass api");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    const result = await sql`SELECT * FROM createAcc WHERE email = ${email};`;

    if (result.error) {
      console.log("Database Error CheckEmail forgot:", result.error);
      return { error: "Database error" };
    }
    console.log("Result recieved from db: ", result);
    if (result.rowCount === 0) {
      console.log("Email not found");
      res.json({ check: false });
      return;
    } else {
      console.log("Email found");
      const result2 =
        await sql`UPDATE createAcc SET password = ${pass} WHERE email = ${email};`;
      if (result2.error) {
        console.log("Database Error updating new password:", result2.error);
        return { error: "Database error" };
      }
      res.json({ check: true });
    }

    res.json({ check: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
