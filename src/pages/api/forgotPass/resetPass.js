import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to check if email exists
export default async function CheckEmail(req, res) {
  try {
    const email = req.body.email[0];
    const pass = req.body.password;
    console.log("Email recieved from frontend: ", email);
    console.log("Password recieved from frontend: ", pass);
    if (!email) {
      console.log("content empty no email on resetPass api");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    const result = await sql`SELECT * FROM createAcc WHERE email = ${email};`; //Check if user exists

    if (result.error) {
      console.log("Database Error CheckEmail forgot:", result.error);
      return { error: "Database error" };
    }
    if (result.rowCount === 1) {
      console.log("Email found and first result: ", email, pass);
      const result2 =
        await sql`UPDATE createAcc SET password = ${pass} WHERE email = ${email};`;
      if (result2.error) {
        console.log("Database Error updating new password:", result2.error);
        res.status(500).json({ error: "Database error in result 2" });
      } else {
        console.log("Password updated");
        res.json({ check: true });
      }
    }

    res.json({ check: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
