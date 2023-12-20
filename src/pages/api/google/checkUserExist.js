import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function CheckUserExist(req, res) {
  console.log("CHECKING");
  try {
    const content = req.body.email;

    console.log("content: ", content);

    if (!content) {
      console.log("content empty");
      res
        .status(400)
        .json({ error: "Content cannot be empty on Check user exist." });
      return;
    }

    const email = content;

    const result = await sql`SELECT * FROM createAcc WHERE email = ${email};`;
    console.log("Result fetched: ", result.rows[0].gender);
    if (
      result.rows[0].gender !== null ||
      result.rows[0].gender !== undefined ||
      result.rows[0].gender != ""
    ) {
      res.json({ user: true });
      return;
    } else {
      res.json({ user: false });
    }
  } catch (error) {
    console.log("Error cought on creating token /getToken.js: ", error);
    res
      .status(500)
      .json({ error: "Internal server error related to /getToken.js" });
  }
}
