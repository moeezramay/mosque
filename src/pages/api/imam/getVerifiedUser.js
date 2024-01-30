import { sql } from "@vercel/postgres";
import axios from "axios";

const dotenv = require("dotenv");
dotenv.config();

export default async function VerifiedUserGET(req, res) {
  try {
    console.log("function start");
    //Get email from body
    const email1 = req.body;

    //Check if email is valid
    if (!email1 || email1 === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      const checkEmail = await sql`SELECT createAcc.*
      FROM createAcc
      JOIN verify ON createAcc.email = verify.user_email
      WHERE verify.imam_email = ${email1}
        AND verify.verification = 'Verified';`;

      res.json({ data: checkEmail.rows });

      if (checkEmail.rows.length === 0) {
        return res.status(400).json({ error: "Email is not verified" });
      }
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
