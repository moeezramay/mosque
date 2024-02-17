import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function To  profile
export default async function setProfileImg(req, res) {
  try {
    const content = req.body;

    const decodedImage = Buffer.from(req.body.image, "base64");
    const email = req.body.email;
    try {
      const result =
        await sql`UPDATE createacc SET picture = ${decodedImage} WHERE email = ${email};`;
      res.json({ message: "Success" });
    } catch (error) {
      return res.status(500).json({ error: "Error in adding Profile Photo" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
