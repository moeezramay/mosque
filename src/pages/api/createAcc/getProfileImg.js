import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function getProfileImg(req, res) {
  try {
    const email = req.body.email;
    try {
      const result =
        await sql`SELECT picture FROM picture WHERE email = ${email};`;
      let imageBase64 = Buffer.from(result.rows[0].picture);
      imageBase64 = imageBase64.toString("utf-8");
      imageBase64 = Buffer.from(JSON.parse(imageBase64).data);
      imageBase64 = imageBase64.toString("base64");

      res.json({ image: imageBase64 });
    } catch (error) {
      return res.status(500).json({ error: "Error in adding Profile Photo" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
